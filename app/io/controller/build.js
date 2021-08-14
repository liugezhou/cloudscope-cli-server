'use strict';

const REDIS_PREFIX = 'cloudbuild'
const CloudBuildTask = require('../../models/CloudBuildTask')
const { SUCCESS,FAILED} = require('../../constant')
async function createCloudBuildTask(ctx,app){
  const { socket,helper } = ctx
  const { redis } = app
  const client = socket.id
  const redisKey = `${REDIS_PREFIX}:${client}`
  const redisTask = await redis.get(redisKey)
  const task = JSON.parse(redisTask)
  socket.emit('build',helper.parseMsg('create task',{
    message:'创建云构建任务'
  }))
  return new CloudBuildTask({
    repo:task.repo,
    name:task.name,
    version:task.version,
    branch:task.branch,
    buildCmd:task.buildCmd,
  },ctx) 
}

async function prepare(cloudBuildTask,socket,helper) {
  socket.emit('build',helper.parseMsg('prepare',{
    message:'开始执行构建前的准备工作'
  }))
  const prepareRes = await cloudBuildTask.prepare()
  if(!prepareRes || Object.is(prepareRes.code,FAILED)){
    const msg = prepareRes ? prepareRes.message : '无'
    socket.emit('build',helper.parseMsg('prepare failed',{
      message: `执行云构建准备工作失败，失败原因：${msg}`
    }))
    return
  }
  socket.emit('build',helper.parseMsg('prepare',{
    message:'构建前准备工作成功'
  }))
}
module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      //创建云构建任务
      const {ctx,app} = this
      const { socket,helper } = ctx
      const cloudBuildTask = await createCloudBuildTask(ctx,app)
      try {
        await prepare(cloudBuildTask,socket,helper)
      } catch (e) {
        socket.emit('build',helper.parseMsg('error',{
          message:`云构建失败，捕获失败原因${e.message}`
        }))
        socket.disconnect()
      }
    }
  }
  return Controller;
};