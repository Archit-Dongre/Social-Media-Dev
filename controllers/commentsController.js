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