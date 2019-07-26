import React from 'react'
import PropTypes from 'prop-types'
import {
    render as renderAmis
} from 'amis'
import './AmisRender.css'
import '../node_modules/glyphicons-only-bootstrap/css/bootstrap.min.css'
import { toast, ToastContainer } from "react-toastify"
import axios from 'axios'
import lifecycle from 'react-pure-lifecycle'

const methods = {
    componentDidMount(props) {
    },
    componentDidUpdate(props, prevProps) {
    }
}

/**
 * amis render
 * @param props
 * @returns {*}
 * @constructor
 * @link https://baidu.github.io/amis/docs/sdk
 */
function AmisRender(props) {
    return (
        <div>
            {renderAmis(props.data || {}, {
                //props
            }, {
                //env
                updateLocation: (location/*目标地址*/, replace/*是replace，还是push？*/) => {
                    // 用来更新地址栏
                },
                fetcher: ({ url, method, data, responseType, config, headers }) => {
                    console.log(url, method)
                    console.log(data)
                    console.log(responseType)
                    console.log(config)
                    console.log(headers)
                    config = config || {}
                    config.withCredentials = false
                    responseType && (config.responseType = responseType)

                    if (config.cancelExecutor) {
                        config.cancelToken = new axios.CancelToken(config.cancelExecutor)
                    }

                    config.headers = headers || {}

                    if (method !== 'post' && method !== 'put' && method !== 'patch') {
                        if (data) {
                            config.params = data
                        }

                        return axios[method](url, config)
                    } else if (data && data instanceof FormData) {
                        // config.headers = config.headers || {};
                        // config.headers['Content-Type'] = 'multipart/form-data';
                    } else if (data
                        && typeof data !== 'string'
                        && !(data instanceof Blob)
                        && !(data instanceof ArrayBuffer)
                    ) {
                        data = JSON.stringify(data)
                        // config.headers = config.headers || {};
                        config.headers['Content-Type'] = 'application/json'
                    }
                    console.log(data)
                    console.log(config)

                    return axios[method](url, data, config)
                },
                notify: (type, msg) => {
                    // 用来提示用户
                    console.log(type)
                    toast(msg || '未定义的错误', { type })
                },
                alert: (content) => {
                    // 另外一种提示，可以直接用系统框
                    toast.info(content)
                },
                confirm: (content) => {
                    // 确认框。
                },
                isCancel: (value) => axios.isCancel(value)
            })}
            <ToastContainer/>
        </div>
    )
}


AmisRender.propTypes = {
    data: PropTypes.object.isRequired
}

export default lifecycle(methods)(AmisRender)
