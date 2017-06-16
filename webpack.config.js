/**
 * Created by mahong on 17/6/16.
 */
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
           app:[
               'webpack-hot-middleware/client?reload=true',
               './src/app.js'
           ]
        },
    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        filename: '[name].js',
        publicPath: '/assets/'
    },
    //对象单数 复数数组
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                use: ['style-loader','css-loader']
            },
            {
                test: /\.scss$/,
                include:[
                    path.resolve(__dirname, './src')
                ],
                use:[
                    {loader: 'sass-loader'},
                    {
                        loader: 'css-loader',
                        options:{
                            module: true,
                            localIdentName: '[local]--[hash:base64:6]'
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                use : ['url-loader?limit=8192']
            },
            {
                test: /\.(mp4|ogg|svg)/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=application/font-woff']
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=application/octet-stream']
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=image/svg+xml']
            }
        ]
    },
    resolve:{
        modules: [
            'node_modules',
            path.resolve(__dirname,'/src/common'),
            path.resolve(__dirname,'/src/components')
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename:'../index.html',
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            $:'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
            PT: 'prop-types'
        })
    ],
    devtool: 'cheap-module-eval-source-map'
};