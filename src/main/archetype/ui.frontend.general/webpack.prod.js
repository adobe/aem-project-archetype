const { merge }             = require('webpack-merge');
const TerserPlugin            = require('terser-webpack-plugin');
const CssMinimizerPlugin      = require("css-minimizer-webpack-plugin");
const common                  = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            cacheGroups: {
                main: {
                    chunks: 'all',
                    name: 'site',
                    test: 'main',
                    enforce: true
                }
            }
        }
    },
    performance: { hints: false }
});
