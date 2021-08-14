'use strict';

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');
class ProjectController extends Controller {
  async getTemplate() {
    const { ctx, app } = this;
    console.log(app.config.env);
    const data = await mongo().query('project');
    ctx.body = data;
  }

  async getRedis(){
    const { ctx, app } = this;
    const num = await app.redis.get('number')
    console.log(num)
    ctx.body = 'hello redis'
  }
}

module.exports = ProjectController;
