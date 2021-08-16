'use strict';
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
// Mondodb
const mongodbUrl = 'mongodb://cloudscope:cloudscope@liugezhou.com:27017/cloudscope-cli';

/**
 * OSS
 */
const OSS_ACCESS_KEY = 'LTAI5tDd1aL1afQ1r4zCnx97'
const OSS_ACCESS_SECRET_KEY = fs.readFileSync(path.resolve(userHome,'.cloudscope-cli','oss_access_secret_key')).toString()
const OSS_PROD_BUCKET='cloudscope-cli'
const OSS_DEV_BUCKET='cloudscope-cli-dev'
const OSS_REGION='oss-cn-beijing'
module.exports = {
  mongodbUrl,
  OSS_ACCESS_KEY,
  OSS_ACCESS_SECRET_KEY,
  OSS_PROD_BUCKET,
  OSS_DEV_BUCKET,
  OSS_REGION
};
