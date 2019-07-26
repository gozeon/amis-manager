const express = require('express')
const router = express.Router()
const YLogger = require('yog-log')
const logger = YLogger.getLogger() //默认通过domain获取，单独使用请传递config
const boom = require('boom')
const { CustomError, successResponse } = require('../utils')
const { mysql } = require('../db')
const { check, validationResult, body } = require('express-validator')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')

router.get('/', async function (req, res, next) {
    try {
        const packages = await mysql('mis_group').select('*').where('is_delete', false).debug()
        res.json(successResponse(packages))
    } catch (e) {
        console.log(e)
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})

router.post('/', [
    body('name').not().isEmpty(),
    body('description'),
], async function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(boom.badRequest('参数错误', errors.array()))
    }

    const data = _.pick(req.body, ['name', 'description'])

    data.create_at = new Date()

    try {
        const exists = await mysql('mis_group').select(['name']).where('name', data.name).debug()

        if (!_.isEmpty(exists)) {
            return next(boom.badData(`${data.name}已经存在`, exists))
        }

        const projectIds = await mysql('mis_group').insert(data).debug()
        res.json(successResponse(projectIds))
    } catch (e) {
        return next(boom.boomify(e, { statusCode: 99999 }))
    }
})


module.exports = router
