/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require('mongoose');

//文集表结构

module.exports = new mongoose.Schema({
     //关联字段-用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    collection_name: String,
    collection_id: String
});

