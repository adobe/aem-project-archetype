const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const webpack = require('webpack')
module.exports =
    merge(common, {
        mode: 'production',
        optimization: {
            //minimize: false // for debugging in AEM, uncomment
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
                        THEME_DARKEST: 'false'
                    }
                }
            }),
        ],
    });
