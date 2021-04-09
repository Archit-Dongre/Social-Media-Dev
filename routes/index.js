const express = require("express");
const router = express.Router();
const Post = require("../models/post");
//const User = require("../models/user");

router.get("/" , function(req,res){
    // Post.find({},function(err,post){
    //     User.findOne({id:post.user},function(err,user){
    //         res.render("home" , {title:"Home page" , posts : post , user:user});
    //     });
    // });

    //using populate function to show name of the person who is posting
    Post.find({}).populate('user').exec(function(err,posts){
        res.render("home" , {title:"Home page" , posts : posts});
    });
})

router.use("/users" , require("./users"));

module.exports = router;