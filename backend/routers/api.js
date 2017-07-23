/**
 * Created by mahong on 17/5/24.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Collection = require('../models/Collection');
var cookies = require('cookies');

//统一返回格式
var responseData;
router.use(function(req, res, next){
    responseData = {
        code: 0,
        msg: ''
    }

    next();
});

//注册
router.post('/register', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if(username==""){
        responseData.code = "1";
        responseData.msg = "用户不能为空";
        res.json(responseData);
        return ;
    }


    //用户是否已经注册 数据库操作
    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = "4";
            responseData.msg = "用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            //数据库每一条数据记录就是一个对象  通过操作model对象操作数据库
            var user = new User({
                username: username,
                password: password
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        //cookie里不能有汉字,汉字需要编码
        newUserInfo.username = encodeURI(newUserInfo.username);
        console.log(newUserInfo);
        console.dir(newUserInfo);
        responseData.data = {
            avatar: '',
            user_id: newUserInfo._doc._id,
            user_name: newUserInfo._doc.username,
            user_intro: ''
        }
        responseData.msg = "用户注册成功";
        req.cookies.set("userInfo",JSON.stringify({
            user_id: newUserInfo._doc._id,
            user_name: newUserInfo._doc.username
        }));
        res.json(responseData);
    })

});

//登陆

router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    if(username==""||password==""){
        responseData.code= "1";
        responseData.msg = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = "2";
            responseData.msg = "用户名或密码错误"
            res.json(responseData);
            return;
        }

        responseData.code = "0";
        responseData.msg = "用户登录成功";
        responseData.data = {
            user_id : userInfo._id,
            user_name : userInfo.username
        };
        //请求返回的时候,后端像浏览器发送cookie,浏览器保存cookie,每次请求的时候会把cookie自动放在http 头部信息里提交给后端
        //jsonp refer 域名 通过手动ajax 添加至头部再提交给后端
        userInfo.username = encodeURI(userInfo.username)
        req.cookies.set("userInfo", JSON.stringify({
            user_id : userInfo._id,
            user_name : userInfo.username
        }));
        res.json(responseData);
    })

});
//自动登录
router.post('/autoLogin', function(req, res){
    req.cookies = new cookies(req, res);
    req.userInfo = {};
    var cookiesUserInfo = req.cookies.get('userInfo');
    console.log(cookiesUserInfo);
    if(cookiesUserInfo){
        req.userInfo = JSON.parse(cookiesUserInfo);
        req.userInfo.user_name = decodeURI(req.userInfo.user_name)
        if(cookiesUserInfo){
            User.findOne({
                username: req.userInfo.user_name
            }).then(function(userInfo){
                if(userInfo){
                    responseData.msg = "自动登录成功";
                    responseData.data = {
                        user_id : userInfo._id,
                        user_name : userInfo.username
                    };  
                    res.json(responseData);
                }
            })
        }
    }else{
        responseData.msg="尚未登陆";
        res.json(responseData);
    }
    

})

//退出
router.get('/logout', function(req, res){
    req.cookies.set("userInfo", null);
    res.json(responseData);

});

router.post("/getCollection", function(req, res){
    var user_id = req.body.user_id;
    if(user_id){
        Collection.find({user: user_id}).then(function(userCollection){
            responseData.msg="查找用户分类成功";
            responseData.data = userCollection;
            res.json(responseData);
        })
    }else{
        Collection.find().then(function(Collection){
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
        console.log("addCollection");
        console.log(collectionInfo);
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
                responseData.data = collections
                res.json(responseData);
            })
        }
    })

});
//获取文章列表
router.post("/getPreview", function(req, res){

})




module.exports =  router;