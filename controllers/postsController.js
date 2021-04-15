const Post = require('../models/post');
const Comment = require("../models/comment");
module.exports.createPost =  async function(req,res){
    try{
        await Post.create({
            content:req.body.content,
            user: req.user._id,
            commentIds : []
            });
        req.flash("success","Post Created!");
        return res.redirect("back");
    }catch(err){
      console.log("Error:",err);
      return ; 
    }
};

module.exports.destroy = async function(req,res){
    try{
      let post =  await Post.findById(req.query.id);
        if(post.user == req.user.id){
           await Comment.deleteMany({post:post.id});
           await post.remove();
           req.flash("success","Successfully Deleted Posts and all Comments");
           return res.redirect("back");
        
        }else{
            console.log("You cant delete this is not your post");
            req.flash("error","You are not authorized to delete this post");
            return res.redirect("back");
        }
    }catch(err){
        console.log("Error:",err);
        return;
    }
    
}