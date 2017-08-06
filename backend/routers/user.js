var express = require('express');
var router = express.Router();
var User = require('../models/User');
var cookies = require('cookies');
var multer = require('multer');
// var upload = multer({ dest: '/Users/mahong/mahong/mh'});
//multer 路径相对于backendsever.js 起后端服务的路径
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './backend/public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ '-'+file.originalname)
  }
})

var upload = multer({ storage: storage })
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
    var user_name = req.body.user_name;
    var password = req.body.password;
    var host = req.headers.host;
    var origin = req.headers.origin;
    if(origin.indexOf(host)>-1){
        //没有跨域
        host = origin;
    }else {
        protocal = origin.split("://")[0]+'://';
        host = protocal + host;
    }
    var avatar = host + '/uploads/user.png';
    if(user_name==""){
        responseData.code = "1";
        responseData.msg = "用户不能为空";
        res.json(responseData);
        return ;
    }
    //用户是否已经注册 数据库操作
    User.findOne({
        user_name: user_name
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = "4";
            responseData.msg = "用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            //数据库每一条数据记录就是一个对象  通过操作model对象操作数据库
            var user = new User({
                user_name: user_name,
                password: password,
                avatar
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        //cookie里不能有汉字,汉字需要编码
        newUserInfo.user_name = encodeURI(newUserInfo.user_name);
        // console.log(newUserInfo);
         console.dir(newUserInfo);
        responseData.data = {
            avatar: newUserInfo._doc.avatar,
            user_id: newUserInfo._doc._id,
            user_name: newUserInfo._doc.user_name,
            user_intro: newUserInfo._doc.user_intro
        }
        responseData.msg = "用户注册成功";
        req.cookies.set("userInfo",JSON.stringify({
            user_id: newUserInfo._doc._id,
            user_name: newUserInfo._doc.user_name
        }));
        res.json(responseData);
    })

});

//更新用户信息 头像
router.post('/editUserAvatar', upload.single('avatar'), function(req, res){
    console.log("req.file")
    console.log(req.file)
    var host = req.headers.host;
    var origin = req.headers.origin;
    if(origin.indexOf(host)>-1){
        //没有跨域
        host = origin;
    }else {
        protocal = origin.split("://")[0]+'://';
        host = protocal + host;
    }
    var user_id = req.body.user_id;
    var avatarImg = req.file;
    var avatarPath = host + '/uploads/'+ avatarImg.filename;
    User.update({_id: user_id},{
        avatar: avatarPath
    }).then(function(user){
        if(user){
            User.findOne({
                _id: user_id
            }).then(function(theUser){
                responseData.data = theUser;
                res.json(responseData);
            })
        }
    })
})
//更新用户信息 自我介绍等
router.post('/editUserInfo', function(req, res){
    console.log("editUserInfo")
    console.log(req)
    var user_id = req.body.user_id;
    var user_intro = req.body.user_intro;
    User.update({_id: user_id},{
        user_intro
    }).then(function(user){
        if(user){
            User.findOne({
                _id: user_id
            }).then(function(theUser){
                responseData.data = theUser;
                res.json(responseData);
            })
        }
        
    })
})



//登陆

router.post('/login', function(req, res){
    var user_name = req.body.user_name;
    var password = req.body.password;

    if(user_name==""||password==""){
        responseData.code= "1";
        responseData.msg = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }
    User.findOne({
        user_name: user_name,
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
            user_name : userInfo.user_name,
            avatar: userInfo.avatar,
            user_intro: userInfo.user_intro
        };
        //请求返回的时候,后端像浏览器发送cookie,浏览器保存cookie,每次请求的时候会把cookie自动放在http 头部信息里提交给后端
        //jsonp refer 域名 通过手动ajax 添加至头部再提交给后端
        userInfo.user_name = encodeURI(userInfo.user_name)
        req.cookies.set("userInfo", JSON.stringify({
            user_id : userInfo._id,
            user_name : userInfo.user_name
        }));
        res.json(responseData);
    })

});
//自动登录
router.post('/autoLogin', function(req, res){
    req.cookies = new cookies(req, res);
    req.userInfo = {};
    var cookiesUserInfo = req.cookies.get('userInfo');
    //console.log(cookiesUserInfo);
    if(cookiesUserInfo){
        req.userInfo = JSON.parse(cookiesUserInfo);
        req.userInfo.user_name = decodeURI(req.userInfo.user_name)
        if(cookiesUserInfo){
            User.findOne({
                user_name: req.userInfo.user_name
            }).then(function(userInfo){
                if(userInfo){
                    responseData.msg = "自动登录成功";
                    responseData.data = {
                        user_id : userInfo._id,
                        user_name : userInfo.user_name,
                        avatar: userInfo.avatar,
                        user_intro: userInfo.user_intro
                    };  
                    res.json(responseData);
                }
            }).then(function(){
                responseData.msg="尚未登陆";
                res.json(responseData);
            })
        }
    }else{
        responseData.msg="尚未登陆";
        res.json(responseData);
    }
    

})

//退出
router.post('/logout', function(req, res){
    req.cookies.set("userInfo", null);
    responseData.msg = "退出登录成功";
    res.json(responseData);

});

//获取作者列表
router.post("/getAuthor", function(req, res){
    User.find().then(function(users){
        if(users){
            users.forEach(function(item, index){
                item.user_id = item._id;
            })
            responseData.msg = "查找用户列表成功";
            responseData.data = users;
        }else{
             responseData.msg = "暂无用户";
            responseData.data = [];
        }
        res.json(responseData);
    });
})


module.exports =  router;