'use strict';

const REDIS_PREFIX = 'cloudbuild'
const CloudBuildTask = require('../../models/CloudBuildTask')
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
    buildCmd:task.buildCmd
  }) 
}
module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      //创建云构建任务
      const {ctx,app} = this
      const cloudBuildTask = await createCloudBuildTask(ctx,app)
    }
  }
  return Controller;
};