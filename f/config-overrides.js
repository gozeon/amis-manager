/* config-overrides.js */
const { override, addBabelPlugins } = require('customize-cra')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

function addoMonacoWebpackPlugin(config, env) {
    if (!config.plugins) {
        config.plugins = []
    }
    config.plugins.push(
        new MonacoWebpackPlugin({
            // languages: ["javascript", "typescript", "html", "json"]
            languages: ["json"]
        })
    )
    return config
}

module.exports = override(
    ...addBabelPlugins(
        "@babel/plugin-proposal-function-bind"
    ),
    addoMonacoWebpackPlugin
)