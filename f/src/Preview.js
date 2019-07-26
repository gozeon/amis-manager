import React from 'react'
// import emitter from "./eventm"
import AmisRender from './AmisRender'
import PropTypes from 'prop-types'

// class Preview extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             msg: null,
//         }
//
//     }
//
//     componentDidMount() {
//         this.eventEmitter = emitter.addListener('cc', msg => {
//             this.setState({ msg })
//         })
//     }
//
//     componentWillUnmount() {
//         emitter.removeEventListener(this.eventEmitter)
//     }
//
//     render() {
//         return (
//             <div>
//                 <AmisRender data={{
//                     "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
//                     "type": "page",
//                     "body": {
//                         "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
//                         "type": "form",
//                         "title": "联系我们",
//                         "controls": [
//                             {
//                                 "type": "text",
//                                 "label": "姓名",
//                                 "name": "name"
//                             },
//                             {
//                                 "type": "email",
//                                 "label": "邮箱",
//                                 "name": "email",
//                                 "required": true
//                             },
//                             {
//                                 "type": "textarea",
//                                 "label": "内容",
//                                 "name": "content",
//                                 "required": true
//                             }
//                         ],
//                         "actions": [
//                             {
//                                 "label": "发送",
//                                 "type": "submit",
//                                 "primary": true
//                             }
//                         ]
//                     }
//                 }}/>
//             </div>)
//     }
// }

function Preview(props) {
    return (
        <div>
            <AmisRender data={props.reviewData}/>
        </div>)
}

Preview.propTypes = {
    reviewData: PropTypes.object.isRequired
}

export default Preview