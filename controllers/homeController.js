const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function(req,res){
    //nested populate 
    try{
        let posts = await Post.find({}).populate({path:'user'})
                      .populate({path:"commentIds" , populate:{
                         path:'user'
                      }});
    
    let users = await User.find({});
    
    return res.render('home',{title:'Home Page',posts:posts,all_users:users});
    }catch{
        console.log("Error",err);
        return ;
    }
    
};