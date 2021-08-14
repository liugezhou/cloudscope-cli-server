'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/project/template', controller.project.getTemplate);
  router.get('/redis/test', controller.project.getRedis);

  // app.io.of('/')
  // app.io.route('build', app.io.controller.chat.index);
  app.io.route('build', app.io.controller.build.index);

  // app.io.of('/chat')
  // app.io.of('/chat').route('chat', app.io.controller.chat.index);
  
};
