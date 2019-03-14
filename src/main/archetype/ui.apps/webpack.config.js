'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

const FC_APPS_ROOT = __dirname + '/src/main/content/jcr_root/apps/${appsFolderName}';
const CLIENTLIBS_PATH = FC_APPS_ROOT + '/clientlibs';

module.exports = (env) => {
    return {
        resolve: {
            extensions: ['js', '.ts'],
            plugins: [new TSConfigPathsPlugin({
                configFile: "./tsconfig.json"
            })]
        },
        entry: {
            site: CLIENTLIBS_PATH + '/clientlib-site/webpack/main.ts',
            dependencies: CLIENTLIBS_PATH + '/clientlib-site/webpack/vendors.js'
        },
        output: {
            filename: (chunkData) => {
                return chunkData.chunk.name === 'dependencies' ? 'clientlib-dependencies/[name].js': 'clientlib-site/[name].js';
            },
            path: CLIENTLIBS_PATH
        },
        optimization: {
            minimizer: [
                new OptimizeCSSAssetsPlugin({
                    cssProcessorPluginOptions: {
                        cssProcessor: require('cssnano'),
                        preset: ['default', {
                            calc: true,
                            convertValues: true,
                            discardComments: {
                                removeAll: true
                            },
                            discardDuplicates: true,
                            discardEmpty: true,
                            mergeRules: true,
                            normalizeCharset: true,
                            reduceInitial: true, // This is since IE11 does not support the value Initial
                            svgo: true
                        }],
                    },
                    canPrint: false
                })
            ],
            splitChunks: {
                cacheGroups: {
                    main: {
                        chunks: 'all',
                        name: 'site',
                        test: 'main',
                        enforce: true
                    },
                    vendors: {
                        chunks: 'all',
                        name: 'dependencies',
                        test: 'vendors',
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: [
                        /(node_modules)/,
                        path.resolve(__dirname, '/src/main/content/jcr_root/apps/${appsFolderName}/clientlibs/clientlib-dependencies/js'),
                        path.resolve(__dirname, '/src/main/content/jcr_root/apps/${appsFolderName}/clientlibs/**/vendors.js')
                    ],
                    use: [
                        {
                            loader: "ts-loader"
                        },
                        {
                            loader: "webpack-import-glob-loader",
                            options: {
                                url: false
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: "webpack-import-glob-loader",
                            options: {
                                url: false
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: "less-loader",
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: "webpack-import-glob-loader",
                            options: {
                                url: false
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'clientlib-[name]/[name].css'
            }),
            new TSLintPlugin({
                files: ['./**/components/**/*.ts']
            })
        ],
        devtool: 'source-map',
        performance: {
            hints: false
        },
        stats: {
            assetsSort: "chunks",
            builtAt: true,
            children: false,
            chunkGroups: true,
            chunkOrigins: true,
            colors: false,
            errors: true,
            errorDetails: true,
            env: true,
            modules: false,
            performance: true,
            providedExports: false,
            source: false,
            warnings: true
        }
    }
};
