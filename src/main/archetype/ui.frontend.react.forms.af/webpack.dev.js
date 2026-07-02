const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const webpack = require('webpack')
const path = require('path');
require('dotenv').config({ path: './.env' });

module.exports =
    merge(common, {
        mode: 'development',
        devtool: 'source-map',
        performance: {hints: 'warning'},
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            client: {
                overlay: false
            },
            compress: true,
            port: 3000,
            proxy: {
                '/adobe': 'http://localhost:4502',
                '/content': 'http://localhost:4502'
            }
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                generateStatsFile: true,
                openAnalyzer: false,
            }),
            new webpack.DefinePlugin({
                process: {
                    browser: true,
                    env: {
                        SCALE_MEDIUM: 'true',
                        SCALE_LARGE: 'false',
                        THEME_LIGHT: 'true',
                        THEME_LIGHTEST: 'false',
                        THEME_DARK: 'false',
                        THEME_DARKEST: 'false',
                        FORMPATH: `'${process.env.FORMPATH}'`
                    }
                }
            }),
        ],
    });
