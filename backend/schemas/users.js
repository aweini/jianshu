/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require('mongoose');
//用户的表结构 

module.exports = new mongoose.Schema({
    user_name: String,
    password: String,
    avatar: {
        type: String,
        default: ""
    },
    user_intro: {
        type: String,
        default: "暂无简介"
    },
    user_id: String
});

