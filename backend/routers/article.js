/**
 * Created by mahong on 17/5/24.
 */
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


//获取文章列表
router.post("/getPreview", function(req, res){
    let user_id = req.body.user_id;
    let collection_id = req.body.collection_id;
    let pageIndex = Number(req.body.pageIndex||1);
    let pageNum =  Number(req.body.pageNum||10);
    console.log(pageNum);
    console.log('pageNum');
    let skipNum = 0;
    let totalPages = 0

    function counterItem(count, totalPages,pageIndex,pageNum,skipNum){
        totalPages = Math.ceil(count/pageNum);
        pageIndex = Math.min(pageIndex, totalPages);
        pageIndex = Math.max(pageIndex,1);
        skipNum = (pageIndex-1)*pageNum;
        return {
            skipNum,
            pageNum
        }
    }
    console.log("获取文章列表");
    console.log(user_id);
    if(user_id){
        if(collection_id){
            Article.count({
                user: user_id, the_collection: collection_id
            }).then(function(count){
                let {skipNum:skipnum, pageNum:pagenum} = counterItem(count, totalPages,pageIndex,pageNum,skipNum);
                Article.find({user: user_id, the_collection: collection_id}).skip(skipnum).limit(pagenum).populate(['user','the_collection']).then(function(articles){
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

            })
            
        }else{
            Article.count({
                user: user_id
            }).then(function(count){
                let {skipNum:skipnum, pageNum:pagenum} = counterItem(count, totalPages,pageIndex,pageNum,skipNum);
                Article.find({user: user_id}).skip(skipnum).limit(pagenum).populate(['user','the_collection']).then(function(articles){
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
            })
           
        }
       
    }else{
         Article.count().then(function(count){
            let {skipNum:skipnum, pageNum:pagenum} = counterItem(count, totalPages,pageIndex,pageNum,skipNum);
            Article.find().limit(pagenum).skip(skipnum).populate(['user','the_collection']).then(function(articles){
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
         })
        
        
    }

})


router.post("/addArticle", function(req, res){
    var article_title = req.body.article_title;
    var article_content = req.body.article_content;
    var user_id = req.body.user_id; 
    var collection_id = req.body.collection_id;
    // var collection_name = req.body.collection_name;
    if(!collection_id){
        responseData.code = 2;
        responseData.msg = "请选择文集";
        res.json(responseData);
        return;
    }
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