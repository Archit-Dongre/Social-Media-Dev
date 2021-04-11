const Post = require('../models/post');
module.exports.createPost = function(req,res){
    console.log(req.user);
    Post.create({
        content:req.body.content,
        user: req.user._id,
        commentIds : []
    },function(err,post){
        if(err){console.log("Error in creating a post");return;}
        return res.redirect("back");
    })
};