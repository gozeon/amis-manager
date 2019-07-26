const express = require('express')
const router = express.Router()
const YLogger = require('yog-log')
const logger = YLogger.getLogger() //默认通过domain获取，单独使用请传递config
const boom = require('boom')
const { CustomError, successResponse } = require('../utils')
const { mysql } = require('../db')
const { check, validationResult, body, param, query } = require('express-validator')
const _ = require('lodash')

router.get('/', [query('name')], async function (req, res, next) {
    try {
        const packages = await mysql('mis_project').select('*')
            .where('name', 'like', `%${req.query.name || ''}%`)
            .where('is_delete', false).debug().orderBy('create_at', 'desc')
        res.json(successResponse(packages))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.get('/:id', [param('id').not().isEmpty()], async function (req, res, next) {
    try {
        const project = await mysql('mis_project').select('*').where('id', req.params.id).where('is_delete', false).debug()
        const pages = await mysql('mis_page').select('*').where('project_id', req.params.id).where('is_delete', false).debug()

        if (_.isEmpty(project)) {
            return next(boom.notFound(`ID:${req.params.id} 项目没找到`))
        }

        res.json(successResponse(Object.assign({}, project[0], { pages: pages })))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.post('/', [
    body('name').not().isEmpty(),
    body('description'),
    body('auth_id').not().isEmpty(),
], async function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(boom.badRequest('参数错误', errors.array()))
    }

    const data = _.pick(req.body, ['name', 'description', 'auth_id'])
    data.create_at = new Date()

    try {
        const exists = await mysql('mis_project').select('name').where('name', data.name).debug()

        if (!_.isEmpty(exists)) {
            return next(boom.badData(`${data.name}已经存在`, exists))
        }

        const projectIds = await mysql('mis_project').insert(data).debug()
        res.json(successResponse(projectIds))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})


module.exports = router
