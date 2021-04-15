const express = require("express");
const { populate } = require("../models/post");
const router = express.Router();
const homeController = require("../controllers/homeController.js");
const Post = require("../models/post");
const User = require("../models/user");
const flashMiddleware = require("../config/middleware");
//router.get("/" , function(req,res){
    // Post.find({},function(err,post){
    //     User.findOne({id:post.user},function(err,user){
    //         res.render("home" , {title:"Home page" , posts : post , user:user});
    //     });
    // });

    //using populate function to show name of the person who is posting
//     Post.find({})
//     .populate({path:'user'})
//     .populate(
//         {
//             path:'commentIds',
//             populate:{
//                 path:'user'
//             }
//         }).exec(function(err,posts){
//         User.find({},function(err,user){
//            return res.render("home" , {title:"Home page" , posts : posts,all_users:user});
//         });
//     });
// })


// lets do the above function of populating posts , users and rendering the home page in async await fashion 

router.get("/",homeController.home);
router.use("/users" , require("./users"));

module.exports = router;