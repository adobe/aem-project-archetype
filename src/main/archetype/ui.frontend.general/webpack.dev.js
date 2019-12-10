const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   performance: {hints: "warning"},
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html')
      })
   ],
   devServer: {
      inline: true,
      proxy: [{
         context: ['/content', '/etc.clientlibs'],
         target: 'http://localhost:4502',
      }]
   }
});