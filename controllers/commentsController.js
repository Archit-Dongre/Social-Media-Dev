const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.createComment = async function(req,res){
    let post = await Post.findOne({_id: req.body.post_id});
    try{
        if(post){
            let comment =await Comment.create({
                content:req.body.content,
                user: req.user._id,
                post : req.body.post_id
            });
            post.commentIds.push(comment);
            post.save();
            return res.redirect("back");
        }else{
            return res.redirect("back");
        }
    }catch(err){
        console.log.error("Error:",err);
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
            return res.redirect("back");
        }else{
            console.log("Not your comment to delte m8");
            return res.redirect("back");
        }
    }catch(err){
        console.log("Error:",err);
        return res.redirect("back");
    }
}