require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const hash = isDev ? '' : '.[contenthash:8]'

module.exports = {
    mode: process.env.NODE_ENV,
    entry: ['@babel/polyfill']
        .concat(
            isDev
                ? [
                    'react-hot-loader/patch',
                    'webpack/hot/dev-server',
                    'webpack-hot-middleware/client'
                ]
                : []
        )
        .concat(['./src/client.js']),
    output: {
        path: path.resolve(__dirname, 'dist/static'),
        publicPath: '/assets/',
        filename: `js/[name]${hash}.js`,
        chunkFilename: `js/[name]${hash}.js`
    },
    devtool: isDev
        ? 'inline-source-map'
        : false,
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'i/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    isDev
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'entry',
                                corejs: 3
                            }],
                            '@babel/preset-react'
                        ],
                        plugins:
                            isDev
                                ? ['react-hot-loader/babel']
                                : []
                    }
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `css/[name]${hash}.css`,
            chunkFilename: `css/[name]${hash}.css`
        }),
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new LoadablePlugin({
            writeToDisk: true
        })
    ].concat(
        isDev
            ? [new webpack.HotModuleReplacementPlugin()]
            : [new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: {
                        removeAll: true } }],
                },
                canPrint: true
            })]
    ),
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
}