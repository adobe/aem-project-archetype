const merge              = require('webpack-merge');
const common             = require('./webpack.common.js');
const path               = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = env => {
    const writeToDisk = env && Boolean(env.writeToDisk);
    const plugins = [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html')
      })
    ];

    writeToDisk && plugins.push(
      new WebpackShellPlugin({
        onBuildExit:['clientlib && npm run sync']
      })
    );

    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        performance: { hints: 'warning' },
        plugins,
        devServer: {
            inline: true,
            proxy: [{
                context: ['/content', '/etc.clientlibs'],
                target: 'http://localhost:4502',
            }],
            writeToDisk,
            liveReload: !writeToDisk
        }
    });
}