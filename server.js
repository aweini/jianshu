/**
 * Created by mahong on 17/6/16.
 */
const path = require('path');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require("./webpack.config");
const webpack = require("webpack");
let compiler = webpack(config);
let app = new express();
let port = 8088;

app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler, {publicPath: '/assets/'}));


//webpackDevMiddleware把编译的js放在内存里目录/assets/ ,publicPath用于让js可读取, 并不会管index.html,所以我们访问的是原始的index.html
//index.html里的js引用要写成/assets/app.js 用来读取内存里的js
//如果不用webpackDevMiddlewar,只用webpack打包就会完全使用webpack.config里的配置,html-webpack-plugin会管理index.html,publicPath用于html文件里插入js的路径
app.get('/*',(req, res)=>{ res.sendFile(__dirname+'/src/index.html')});

app.listen(port);