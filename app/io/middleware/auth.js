'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const {socket,logger} = ctx
    const query = socket.handshake.query
    logger.info(query)
    console.log('connect!')
    await next();
    console.log('disconnect!');
  };
};