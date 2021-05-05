const Post = require('../../../models/post');
const Comment = require("../../../models/comment");
const { SchemaType, Types } = require('mongoose');
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
        if(post.user == req.user.id){
           await Comment.deleteMany({post:post.id});
           await post.remove();
           
          return res.json(200,{
              message:'Post and associated comments deleted successfully'
          });
          
        }else{
            return res.json(401,{
                message:'You are unauthorized to delete this'
            });
        }
    }catch(err){
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}