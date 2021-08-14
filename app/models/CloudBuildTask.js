'use strict';

const path = require('path')
const fse = require('fs-extra')
const userHome = require('user-home')
const Git = require('simple-git')
const {SUCCESS,FAILED} = require('../constant')
class CloudBuildTask {
    constructor(options,ctx){
        this._ctx = ctx
        this._name = options.name //项目名称
        this._version = options.version //项目版本号
        this._repo = options.repo
        this._branch = options.branch 
        this._buildCmd = options.buildCmd //构建命令
        this.logger = this._ctx .logger
        // 服务器的用户主目录
       this._dir = path.resolve(userHome,'.cloudscope-cli','cloudbuild',`${this._name}@${this._version}`) //缓存目录
       this._sourceCodeDir = path.resolve(this._dir,this._name) //缓存源码目录
       this.logger.info('_dir',this._dir)
       this.logger.info('_sourceCodeDir',this._sourceCodeDir)
    }

    async prepare(){
        fse.ensureDirSync(this._dir)
        fse.emptyDirSync(this._dir)
        this._git = new Git(this._dir)
        return this.success()
    }
    success(msg,data){
        return this.response(SUCCESS,msg,data)
    }
    fail(msg,data){
        return this.response(FAILED,msg,data)
    }
    response(code,message,data){
        return {
            code,
            message,
            data
        }
    }
}

module.exports = CloudBuildTask