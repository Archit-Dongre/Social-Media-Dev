 const Post = require('../../../models/post');
 const Comment = require("../../../models/comment");
 module.exports.index = async function(req,res){
 let posts = await Post.find({})
                    .sort("-createdAt")
                    .populate({path:'user', select:{'password':0}})
                    .populate({path:"commentIds" , populate:{
                                                       path:'user',
                                                       select:{'password':0}
                                                    }
                    });
    
    
     return res.json(200,{
         message:"List of posts",
         posts: posts
     })
 }

 module.exports.destroy = async function(req,res){
    try{
      let post =  await Post.findById(req.params.id);
        //if(post.user == req.user.id){
           await Comment.deleteMany({post:post.id});
           await post.remove();
           
          return res.json(200,{
              message:'Post and associated comments deleted successfully'
          });
        //    req.flash("success","Successfully Deleted Posts and all Comments");
        //    return res.redirect("back");
        // }else{
        //     console.log("You cant delete this is not your post");
        //     req.flash("error","You are not authorized to delete this post");
        //     return res.redirect("back");
        // }
    }catch(err){
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}