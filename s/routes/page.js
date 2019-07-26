const express = require('express')
const router = express.Router()
const YLogger = require('yog-log')
const logger = YLogger.getLogger() //默认通过domain获取，单独使用请传递config
const boom = require('boom')
const { CustomError, successResponse } = require('../utils')
const { mysql } = require('../db')
const { check, validationResult, body, param, query } = require('express-validator')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')

router.get('/', [query('projectId')], async function (req, res, next) {
    try {
        const dbQuery = mysql('mis_page').select('*')
            .where('is_delete', false).debug().orderBy('create_at', 'desc')
        if (req.query.projectId) {
            dbQuery.where('project_id', req.query.projectId)
        }
        const pages = await dbQuery
        res.json(successResponse(pages))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.get('/:id', [param('id').not().isEmpty()], async function (req, res, next) {
    try {
        const page = await mysql('mis_page').select('*').where('id', req.params.id).where('is_delete', false).debug()

        if (_.isEmpty(page)) {
            return next(boom.notFound(`ID:${req.params.id} 页面没找到`))
        }

        res.json(successResponse(page))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.put('/', [
    body('id').not().isEmpty(),
    body('name'),
    body('url'),
    body('data'),
    body('project_id'),
    body('group_id'),
], async function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(boom.badRequest('参数错误', errors.array()))
    }

    const data = _.pick(req.body, ['id', 'name', 'url', 'data', 'project_id', 'group_id'])

    if (data.url.endsWith('/')) {
        data.url = data.url.slice(0, data.url.length - 1)
    }

    try {
        const exists = await mysql('mis_page').select('*').where('id', data.id).debug()

        if (_.isEmpty(exists)) {
            return next(boom.badData(`${data.id} 不存在`, exists))
        }

        const pageIds = await mysql('mis_page').where('id', data.id).update(data).debug()
        res.json(successResponse(pageIds))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.post('/', [
    body('name').not().isEmpty(),
    body('url').not().isEmpty(),
    body('data').not().isEmpty(),
    body('project_id').not().isEmpty(),
    body('group_id'),
], async function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(boom.badRequest('参数错误', errors.array()))
    }

    const data = _.pick(req.body, ['name', 'url', 'data', 'project_id', 'group_id'])

    if (_.isUndefined(data.group_id)) {
        data.group_id = null
    }

    if (data.url.endsWith('/')) {
        data.url = data.url.slice(0, data.url.length - 1)
    }

    data.hex = uuidv4()
    data.create_at = new Date()

    try {
        // TODO: 验证 project_id, group_id 是否存在
        const exists = await mysql('mis_page').select(['name', 'url', 'project_id']).where('url', data.url)
            .where('project_id', data.project_id).debug()

        if (!_.isEmpty(exists)) {
            return next(boom.badData(`${data.url}已经存在`, exists))
        }

        const pageIds = await mysql('mis_page').insert(data).debug()
        res.json(successResponse(pageIds))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})


module.exports = router
