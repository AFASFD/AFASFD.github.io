
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
router.use(function(req,res,next){
    data={
        userInfo: req.userInfo,
        categories: []
    }
    Category.find().then(function(categories){
        data.categories=categories;
        next();
    });
});
router.get('/',function(req,res){
    data.category=req.query.category||'';
    data.contents=[];
    data.count=0;
    data.page=Number(req.query.page || 1);
    data.limit=4;
    data.pages=0;
    var where={};
    if(data.category){
        where.category=data.category
    }
    Content.where(where).count().then(function(count){
        //总数据数
        data.count=count;
        //总页数
        data.pages=Math.ceil(data.count/data.limit);
        //最大页数
        data.page=Math.min(data.page,data.pages);
        //最小页数
        data.page=Math.max(data.page,1);
        var skip=(data.page-1)*data.limit;

        return Content.find().where(where).limit(data.limit).skip(skip).populate(['categories','user']).sort({
            addTime: -1
        });
    }).then(function(contents){
        data.contents=contents;
        res.render('main/index',data); 
    });
});
router.get('/main/view',function(req,res){
    var contentId=req.query.contentid||'';
    Content.findById({
        _id: contentId
    }).then(function(content){
        data.content=content;

        content.views++;
        content.save();
        res.render('main/view',data);
    });
});

module.exports = router;