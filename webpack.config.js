const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const { NODE_ENV } = process.env
const __DEV__ = NODE_ENV === 'development'

module.exports = {
    mode: NODE_ENV,
    entry: {
        app: path.resolve(__dirname, 'src/index')
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    devServer: {
        host: '0.0.0.0',
        port: 777,
        publicPath: '/',
        contentBase: path.join(__dirname, 'docs'),
        stats: 'errors-only',
        compress: true,
        hot: true
    },
    devtool: __DEV__
        ? 'inline-source-map'
        : false,
    resolve: {
        extensions: ['.js', '.sass']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.sass$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: __DEV__
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css'
        }),
        new CopyPlugin([
            { from: './src/public' }
        ]),
        new webpack.DefinePlugin({
            __DEV__
        })
    ]
}