/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require('mongoose');

//用户的表结构

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: "/backend/assets/images/cat1.jpg"
    }
});

