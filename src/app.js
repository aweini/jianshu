/**
 * Created by mahong on 17/6/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Frame from './layout/frame/Frame.js';
import 'semantic-ui/dist/semantic.js';
import S from 'semantic-ui/dist/semantic.css';
import "./style.css";
import cfg from 'config/config.json';

if(location.href.indexOf("9000")>0){
    cfg.url = cfg.url_dest;
}else if(location.href.indexOf("47.93.207.99")>0){
    cfg.url = cfg.aliyun;
}

//上面两种加载css的方式都可以让css成为全局变量 require ('semantic-ui/dist/semantic.js');也可以
//cors方式解决跨域问题，但是cookies默认是不发送给后端的，这样后端就无法判断是否前端是否有cookie是否已经登录
//这个设置是 授权 让发送cookie 
$.ajaxSetup({
    xhrFields: {withCredentials: true}
});

ReactDOM.render(
    <Router>
        <Route path="/" component={Frame} />
    </Router>,
    document.getElementById("root")
)