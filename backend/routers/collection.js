var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Collection = require('../models/Collection');
var Article = require('../models/Article');

//统一返回格式
var responseData;
router.use(function(req, res, next){
    responseData = {
        code: 0,
        msg: ''
    }
    next();
});

router.post("/getCollection", function(req, res){
    var user_id = req.body.user_id;
    if(user_id){
        Collection.find({user: user_id}).then(function(userCollection){
            if(userCollection){
                userCollection.forEach(function(item){
                    item.collection_id = item._id;
                })
            }
            responseData.msg="查找用户分类成功";
            responseData.data = userCollection;
            res.json(responseData);
        })
    }else{
        Collection.find().then(function(Collection){
            if(Collection){
                Collection.forEach(function(item){
                    item.collection_id = item._id;
                })
            }
            responseData.msg="查找所有分类成功";
            responseData.data = Collection;
            res.json(responseData)
        })
    }
    
});

//添加文集
router.post("/addCollection", function(req, res){
    var user_id = req.body.user_id;
    var addCollection_name = req.body.name;

    Collection.findOne({
        user: user_id,
        name: addCollection_name
    }).then(function(collectionInfo){
        //console.log("addCollection");
        //console.log(collectionInfo);
        if(collectionInfo){
            responseData.code= "4";
            responseData.msg = "文集名已经存在";
            res.json(responseData);
        }else{
            var collection = new Collection({
                collection_name: addCollection_name,
                user: user_id
            });
            return collection.save();
        }
    }).then(function(newCollection){
        if(newCollection){
            responseData.msg = "创建文集成功";
            Collection.find({
                user: user_id
            }).then(function(collections){
                collections.forEach(function(item){
                    item.collection_id = item._id;
                })
                responseData.data = collections
                res.json(responseData);
            })
        }
    })

});

module.exports =  router;