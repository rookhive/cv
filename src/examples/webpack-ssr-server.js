const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './src/server',
    output: {
        path: path.resolve(__dirname),
        filename: 'ssr.js',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    'null-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            emitFile: false,
                            publicPath: '/assets/i/',
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],
    watchOptions: {
        ignored: /node_modules/
    }
}