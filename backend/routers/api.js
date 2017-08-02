/**
 * Created by mahong on 17/5/24.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Collection = require('../models/Collection');
var cookies = require('cookies');
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

//注册
router.post('/register', function(req, res, next){
    var user_name = req.body.user_name;
    var password = req.body.password;

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
                password: password
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

//更新用户信息
router.post('/editUserInfo', function(req, res){
    var user_id = req.body.user_id;
    var user_intro = req.body.user_intro;
    var avatar = req.body.avatar;

    User.update({_id: user_id},{
        user_intro,
        avatar
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
//获取文章列表
router.post("/getPreview", function(req, res){
    let user_id = req.body.user_id;
    let collection_id = req.body.collection_id;
    console.log("获取文章列表");
    console.log(user_id);
    if(user_id){
        if(collection_id){
            Article.find({user: user_id, the_collection: collection_id}).populate(['user','the_collection']).then(function(articles){
                if(articles){
                    articles.forEach(function(item, index){
                        item.user.user_id = item.user._id;
                        item.the_collection.collection_id = item.the_collection._id;
                        item.article_id = item.id;
                    })
                    responseData.data = articles;
                    responseData.msg = "查找文章成功";
                }else{
                    responseData.data = [];
                    responseData.msg = "暂无文章";
                }
                res.json(responseData);
            });
        }else{
            Article.find({user: user_id}).populate(['user','the_collection']).then(function(articles){
                if(articles){
                    articles.forEach(function(item, index){
                        item.user.user_id = item.user._id;
                        item.the_collection.collection_id = item.the_collection._id;
                        item.article_id = item.id;
                    })
                    responseData.data = articles;
                    responseData.msg = "查找文章成功";
                }else{
                    responseData.data = [];
                    responseData.msg = "暂无文章";
                }
                res.json(responseData);
            });
        }
       
    }else{
       
         Article.find().populate(['user','the_collection']).then(function(articles){
            if(articles){
                articles.forEach(function(item, index){
                    item.user.user_id = item.user._id;
                    item.the_collection.collection_id = item.the_collection._id;
                    item.article_id = item.id;
                })
                responseData.data = articles;
                responseData.msg = "查找文章成功";
            }else{
                responseData.data = [];
                responseData.msg = "暂无文章";
            }
            res.json(responseData);
        })
        
    }

})

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

router.post("/addArticle", function(req, res){
    var article_title = req.body.article_title;
    var article_content = req.body.article_content;
    var user_id = req.body.user_id; 
    var collection_id = req.body.collection_id;
    // var collection_name = req.body.collection_name;

    Article.findOne({
        user: user_id,
        article_title: article_title
    }).then(function(article){
        if(article){
            responseData.code = 2;
            responseData.msg = "您的文章名称已经存在";
            res.json(responseData);
        }else{
            var article = new Article({
                user : user_id,
                the_collection: collection_id,
                article_title: article_title,
                article_content : article_content
            });
            return article.save();
        }
    }).then(function(newArticle){
        if(newArticle){
            newArticle.article_id = newArticle._id;
            responseData.data = newArticle;
            responseData.msg = "创建文章成功";
            res.json(responseData);
        }
    })
    
})

router.post("/getArticle", function(req, res){
    var article_id = req.body.article_id;
    Article.findOne({
        _id: article_id
    }).populate('the_collection').then(function(article){
        if(article){
            article.article_id = article._id;
            article.the_collection.collection_id = article.the_collection._id;
            responseData.data = article;
            res.json(responseData);
        }
    })

});

router.post("/editArticle", function(req, res){
    var article_title = req.body.article_title;
    var article_content = req.body.article_content;
    var article_id = req.body.article_id; 
    var collection_id = req.body.collection_id;
    var user_id = req.body.user_id;
    // var collection_name = req.body.collection_name;

    Article.findOne({
        _id : {$ne: article_id},
        article_title: article_title,
        user: user_id
    }).then(function(article){
        if(article){
           responseData.msg="文章名已存在"
           responseData.code = "2";
           res.json(responseData);
        }else{
          return Article.update({
                _id: article_id
           },{
                article_title: article_title,
                article_content: article_content,
                the_collection: collection_id
           })
        }
    }).then(function(editArticle){
        if(editArticle){
            Article.findOne({
                _id: article_id
            }).then(function(article){
                 responseData.msg = "编辑文章成功";
                 responseData.data = article;
                 res.json(responseData);
            })
           
        }
    })
    
})

router.post('/delArticle', function(req, res){
    let article_id = req.body.article_id;
 console.log('article_id')
        console.log(article_id)
    Article.findOne({
        _id: article_id
    }).then(function(article){
        console.log('article')
        console.log(article)
        if(article){
           return Article.remove({
                _id: article
            })
        }
    },function(){
        responseData.code = "2";
        responseData.msg = "文章不存在";
        res.json(responseData);
       
    }).then(function(del){
        if(del){
            console.log("lellele")
            responseData.msg = "删除文章成功";
            res.json(responseData);
        }
        
    })
})


module.exports =  router;