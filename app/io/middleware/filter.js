'use strict';

module.exports = () => {
  return async (ctx, next) => {
    ctx.socket.emit('res', 'packet!' + say);
    await next();
    console.log('packet response!');
  };
};