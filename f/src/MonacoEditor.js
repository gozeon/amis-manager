import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import stringify from 'fast-stringify';
import PropTypes from "prop-types"

class MyMonacoEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '{}',
        }
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor)

        editor.focus()
    }

    // onChange(newValue, e) {
    //     console.log('onChange', newValue, e)
    //     let newCode
    //
    //     try {
    //         newCode = stringify(JSON.parse(newValue))
    //     } catch (e) {
    //         console.log(e)
    //         newCode = {}
    //     }
    //
    //     emitter.emit('editorChange', newCode)
    // }

    transformData(obj) {
        try {
            return stringify(obj, null, 4)
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    render() {
        const { code } = this.props
        const options = {
            selectOnLineNumbers: true,
        }
        return (
            <MonacoEditor
                language="json"
                theme="vs"
                value={::this.transformData(code)}
                options={options}
                onChange={::this.props.handleChange}
                editorDidMount={::this.editorDidMount}
            />
        )
    }
}

MyMonacoEditor.protoTypes = {
    code: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
}

export default MyMonacoEditor
