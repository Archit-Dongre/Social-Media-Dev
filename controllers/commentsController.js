const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.createComment = function(req,res){
    // console.log(req.body);
    // console.log(req.query)
Comment.create({
        content:req.body.content,
        user: req.user._id,
        post : req.body.post_id
    },function(err,comment){
        if(err){console.log("error in creating a comment");return;}
        Post.findOne({_id: req.body.post_id} , function(err,post){
            console.log(comment.post);
            console.log(post);
            post.commentIds.push(comment);
            post.save();
            console.log(post);
            return res.redirect("back");
        })
        
    })
};

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id , function(err,comment){

        if(comment.user == req.user.id){
            let post_id_of_comment = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(post_id_of_comment,{$pull:{commentIds: comment.id}},function(err,post){
                return  res.redirect("back");
            });         
        }else{
            return res.redirect("back");
        }
    });
}