'use strict';

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');
const OSS = require('../models/OSS')
const config = require('../../config/db')
const {success, failed } = require('../utils/request') 
class ProjectController extends Controller {
  async getTemplate() {
    const { ctx } = this;
    const data = await mongo().query('project');
    ctx.body = data;
  }

  async getOSSProject(){
    const { ctx } = this
    let ossProjectType = ctx.query.type
    let ossProjectName = ctx.query.name 
    if(!ossProjectName){
      ctx.body=failed('项目名称不存在')
      return
    }
    if(ossProjectType){
      ossProjectType = 'prod'
    }
    let oss 
    if(Object.is(ossProjectType,'prod')){
       oss = new OSS(config.OSS_DEV_BUCKET)
    }else{
      oss = new OSS(config.OSS_PROD_BUCKET)
    }
    const ossList = await oss.list(ossProjectName)
    ctx.body = success('项目文件获取成功',ossList)
  }

  async getRedis(){
    const { ctx, app } = this;
    const { key } = ctx.query
    if(key){
      const value = await app.redis.get(key)
      ctx.body=`redis[${key}]:${value}`
    }else{
      ctx.body = '没有获取到key'
    }
  }
}

module.exports = ProjectController;
