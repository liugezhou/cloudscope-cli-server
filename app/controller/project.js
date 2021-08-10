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
}

module.exports = ProjectController;
