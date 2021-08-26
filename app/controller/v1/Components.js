'use strict'

const Controller = require("egg").Controller;
const constant = require('../../constant');
const ComponentService = require('../../service/ComponentService');
const VersionService = require('../../service/VersionService')
const { failed, success } = require('../../utils/request')

class ComponentsController extends Controller {

    // api/v1/components
    async index() {
        const { ctx } = this;
        ctx.body = 'get component'
    }

    // api/v1/components/:id
    async show() {
        const { ctx } = this;
        ctx.body = 'get single component'
    }

    // post data
    async create() {
        const { ctx, app } = this;
        const { component, git } = ctx.request.body;
        const timestamp = new Date().getTime()
        // 1. 添加组件信息
        const componentData = {
            name: component.name,
            classname: component.className,
            description: component.description,
            npm_name: component.npmName,
            npm_version: component.npmVersion,
            git_type: git.type,
            git_remote: git.remote,
            git_owner: git.owner,
            git_login: git.login,
            status: constant.STATUS.ON,
            create_dt: timestamp,
            create_by: git.login,
            update_dt: timestamp,
            update_by: git.login,
        };
        const componentService = new ComponentService(app);
        const haveComponentInDB = await componentService.queryOne({
            className: component.className
        })
        let componentId;
        if (!haveComponentInDB) {
            componentId = await componentService.insert(componentData);
        } else {
            componentId = haveComponentInDB.id
        }
        if (!componentId) {
            ctx.body = failed('添加组件失败')
        }
        // 2.添加组件版本信息
        const versionData = {
            component_id: componentId,
            version: git.version,
            build_path: component.buildPath,
            example_path: component.examplePath,
            example_list: JSON.stringify(component.exampleList),
            status: constant.STATUS.ON,
            create_dt: timestamp,
            create_by: git.login,
            update_dt: timestamp,
            update_by: git.login,
        }
        const versionService = new VersionService(app);
        const haveVersionInDB = await versionService.queryOne({
            component_id: componentId,
            version: git.version
        });
        if (!haveVersionInDB) {
            const versionRes = await versionService.insert(versionData)
            if (!versionRes) {
                ctx.body = failed('添加组件失败')
            }
        } else {
            const updateData = {
                build_path: component.buildPath,
                example_path: component.examplePath,
                example_list: JSON.stringify(component.exampleList),
                update_dt: timestamp,
                update_by: git.login,
            };
            const versionRes = await versionService.update(updateData, {
                component_id: componentId,
                version: versionData.version,
            });
            if (!versionRes) {
                ctx.body = failed('更新组件失败');
                return;
            }
        }
        ctx.body = success('添加组件成功', {
            component: await componentService.queryOne({ id: componentId }),
            version: await versionService.queryOne({ component_id: componentId, version: git.version })
        })
    }
}

module.exports = ComponentsController