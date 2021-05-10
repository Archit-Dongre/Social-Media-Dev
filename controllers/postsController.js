const Post = require('../models/post')
const Comment = require("../models/comment");
module.exports.createPost =  async function(req,res){
    try{
        if(!req.user){
           return res.redirect("/user/sign-in");
        }
        
        console.log(req.body);
        let post = await Post.create({
            content:req.body.content,
            user: req.user._id,
            commentIds : []
            })
        if(req.xhr){
          Post.findById(post.id).populate({path:'user'}).exec(function(err,post){
            return res.status(200).json({
                data:{
                    post:{
                        id:post.id,
                        content:post.content,
                        name:post.user.name
                    },
                },
                message:"Post created"
            })
          })
        }
    }catch(err){
      console.log("Error:",err);
      return ; 
    }
}
module.exports.destroy = async function(req,res){
    try{
      let post =  await Post.findById(req.query.id);
        if(post.user == req.user.id){
           await Comment.deleteMany({post:post.id});
           await post.remove();
           
           if(req.xhr){
           return res.status(200).json({
               data:{
                   post_id: req.query.id
               },
               message:'Post deleted'
           })
           }
        //    req.flash("success","Successfully Deleted Posts and all Comments");
        //    return res.redirect("back");
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