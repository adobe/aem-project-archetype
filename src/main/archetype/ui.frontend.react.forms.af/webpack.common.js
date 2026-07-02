const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const alias = Object.keys(pkg.dependencies)
    .reduce((obj, key) => ({...obj, [key]: path.resolve(__dirname, 'node_modules', key)}), {});

module.exports = {
    entry: './src/index.tsx',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AEM Forms - Sample',
            template: "public/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'dist/[name].css',
        })
    ],
    resolve: {
        alias: {
            ...alias
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        //sourceMapFilename: `clientlib-forms-react/resources/[name].map[ext]` // uncomment for debugging
    }
};
