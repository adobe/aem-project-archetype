const merge             = require('webpack-merge');
const common            = require('./webpack.common.js');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const injectScripts     = require('webpack-dev-server-inject-scripts');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = env => {

    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        performance: { hints: 'warning' },
        publicPath: '/',
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html')
            })
        ],
        devServer: {
            inline: true,
            proxy: [{
                context: [
                    '/content',
                    '/etc.clientlibs/opp/clientlibs/clientlib-base.*.*'
                ],
                target: 'http://localhost:4502',
            }],
            before: (app, server, compiler) => {
                app.use(injectScripts(compiler));
            },
        }
    });
}
