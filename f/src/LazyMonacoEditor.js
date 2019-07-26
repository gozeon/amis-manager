import React from 'react'
import PropTypes from 'prop-types'

const LazyMonacoEditor = React.lazy(() => import('./MonacoEditor.js'))
LazyMonacoEditor.protoTypes = {
    code: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
}
export default LazyMonacoEditor
