/**
 * Created by mahong on 17/6/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Frame from './layout/frame/Frame.js';
//require('semantic-ui/dist/semantic.css');
import S from 'semantic-ui/dist/semantic.css'
//上面两种加载css的方式都可以让css成为全局变量
ReactDOM.render(
    <Router>
        <Route path="/" component={Frame} />
    </Router>,
    document.getElementById("root")
)