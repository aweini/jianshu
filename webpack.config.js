/**
 * Created by mahong on 17/6/16.
 */
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowser = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: {
           app:[
            //    'webpack-hot-middleware/client?reload=true',
               './src/app.js'
           ],
            vendor: ['jquery','react','react-dom','prop-types','react-router', 'react-router-dom','semantic-ui/dist/semantic.js']
        },
    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        filename: '[name].[chunkhash].js',
        chunkFilename: "[name].[chunkhash].js",
        publicPath: '/assets/'
    },
    //对象单数 复数数组
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options:{
                                minimize: true //css压缩
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                include:[
                    path.resolve(__dirname, './src')
                ],
                use:[
                    {loader: 'style-loader'},
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
            path.resolve(__dirname,'./src'),
            path.resolve(__dirname,'./src/common'),
            path.resolve(__dirname,'./src/components'),
            path.resolve(__dirname,'./src/layout'),
            path.resolve(__dirname,'./src/view')
        ]
    },
    plugins:[
        // new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename:'../index.html',
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery:'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
            PT: 'prop-types'
        }),
        new OpenBrowser({url: `http://localhost:${8080}`}),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./manifest.json'),
        // })
        // ,
        new webpack.optimize.CommonsChunkPlugin({
                name: ['vendor', 'manifest'], // 指定公共 bundle 的名字。
                minChunks: Infinity,
        }),
        new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        }),
        new ExtractTextPlugin("styles.css"),
        // function() {
        //     this.plugin("done", function(stats) {
        //         require("fs").writeFileSync(
        //         path.join(__dirname, "dist", "stats.json"),
        //         JSON.stringify(stats.toJson()));
        //     });
        // }
        new webpack.HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest"
        }),
      
        new CleanWebpackPlugin(
            ['dist/'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
                dry:      false        　　　　　　　　　　//启用删除文件
            }
        ),
        new CompressionWebpackPlugin({ //gzip 压缩
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(js|css)$'    //压缩 js 与 css
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    devtool: 'cheap-module-eval-source-map'
};