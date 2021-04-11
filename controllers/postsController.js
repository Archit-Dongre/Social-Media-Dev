const Post = require('../models/post');
const Comment = require("../models/comment");
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

module.exports.destroy = function(req,res){
    Post.findById(req.query.id,function(err,post){
        //.id means converting objectId(_id) to string
        if(post.user == req.user.id){
            Comment.deleteMany({post:post.id},function(err){
                if(err){console.log("Error deleting comments of post to be deleted");return;}
            });
            post.remove();
            return res.redirect("back");
        }else{
            console.log('You cant delete this post , you havent written it');
            return res.redirect("back");
        }
    })
}