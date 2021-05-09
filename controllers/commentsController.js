const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require("../mailers/comments_mailer");
module.exports.createComment = async function(req,res){
    try{
        console.log(req.body);

        let post = await Post.findOne({_id: req.body.post_id});
        if(post){
            let comment =await Comment.create({
                content:req.body.content,
                user: req.user._id,
                post : req.body.post_id
            });
            post.commentIds.push(comment._id);
            post.save();
            Comment.findById(comment.id).populate({path:'user'}).exec(function(err,comment){
                
                if(req.xhr){
                    console.log('reached here')
                    commentMailer.newComment(comment);
                    return res.status(200).json({
                        data:{
                            content:comment.content,
                            comment_id:comment.id,
                            user_name:comment.user.name,
                            post_id:comment.post
                        },
                        message:'Comment created'
                    })
                }
            })
            // req.flash("success","Comment Created Successfully!");
            // return res.redirect("back");
        }else{
            return res.redirect("back");
        }
    }catch(err){
        console.log("Error:",err);
        return res.redirect("back");
    }
};

module.exports.destroy = async function(req,res){
    try{

        let comment =await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let post_id_of_comment = comment.post;
            comment.remove();
            let post = await Post.findByIdAndUpdate(post_id_of_comment,{$pull:{commentIds: comment.id}});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment:req.params.id
                    }
                })
            }
            // req.flash("success","Comment Deleted Successfully!");
            // return res.redirect("back");
        }else{
            console.log("Not your comment to delte m8");
            req.flash("error","You are not authorized to delete this comment");
            return res.redirect("back");
        }
    }catch(err){
        console.log("Error:",err);
        return res.redirect("back");
    }
}