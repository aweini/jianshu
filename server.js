/**
 * Created by mahong on 17/6/16.
 */
const path = require('path');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevServer = require('webpack-dev-server');
const OpenBrowser = require('open-browser-webpack-plugin');
const config = require("./webpack.config");
const webpack = require("webpack");
const proxy = require("http-proxy-middleware");
let compiler = webpack(config);
let app = new express();
let port = 8080;
//config.plugins.push(new OpenBrowser({url: 'http://localhost:8080'}));//再这儿写不大管用

config.entry.app.unshift(
    'webpack-hot-middleware/client?reload=true'
)

app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler, {publicPath: '/assets/'}));

//webpackDevMiddleware把编译的js放在内存里目录/assets/ ,publicPath用于让js可读取, 并不会管index.html,所以我们访问的是原始的index.html
//index.html里的js引用要写成/assets/app.js 用来读取内存里的js
//如果不用webpackDevMiddlewar,只用webpack打包就会完全使用webpack.config里的配置,html-webpack-plugin会管理index.html,publicPath用于html文件里插入js的路径


app.use('/api', proxy({target: 'http://localhost:9000', changeOrigin: true}));
app.get('/*',(req, res)=>{ res.sendFile(__dirname+'/src/index.html')});
app.listen(port);

//webpack-dev-server集成了webpack-hot-middleware http-proxy-middleware ，上下两种写法都行

// config.entry.app.unshift(
//     `webpack-dev-server/client?http://localhost:${port}/"`,
//     'webpack/hot/dev-server'
// )
// var server = new webpackDevServer(compiler, {
//         contentBase: './src/',
//         publicPath: '/assets/',
//         hot: true,
//         inline: true,
//         proxy: {
//             '/api/*': {
//                 target: 'http://localhost:9000',
//                 changeOrigin: true,
//                 secure: false
//             }
//         }
// });

// server.listen(port, '127.0.0.1',function(){
//     console.log("Starting server on http://localhost:8080");
// })
