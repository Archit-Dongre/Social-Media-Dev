const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const ForgotPasswordTokens = require("../models/forgotPasswordTokens");
const forgotPasswordMailer = require("../mailers/forgot_password_mailer");
const Post = require("../models/post");
const Likes = require("../models/likes");
const mongoose = require("mongoose");
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }
    res.render("sign-up",{title:"Sign up"});
};

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }
    return res.render("sign-in",{title:"Sign In"});
};

module.exports.create = function(req,res){

    if(req.body.password != req.body.confirm_password){
        console.log("Your passwords dont match G");
        req.flash("error","Passwords dont match G");
        res.redirect("back");
        return;
    }
    User.findOne({email:req.body.email} , function(err,user){
        if(err){console.log("Unable to create user");return;};
        console.log(user);
        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log("error in creating user");return;};
                req.flash("success","Successfully created profile");
                return res.redirect("/users/signIn");
            })
        }else{
            console.log("Your user already exists");
            req.flash("error","User already exists");
            return res.redirect("/users/signUp")
        }
    });


};

module.exports.profile =  function(req, res){
    //To be implemented with help of passport library
    User.findById(req.params.id,function(err,user){
        if(err){
            console.log("Error in displaying user profile");
            return;
        }
       return res.render('user-profile',{title:"User profile",profile_user:user});
    }); 
    
};

//use passport as a middleware to authenticate
module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully!');
    return res.redirect("/");
};

module.exports.signOut = function(req,res){
    req.logOut();
    req.flash('success','Logged out successfully!');
    return  res.redirect("/");
};

module.exports.update = async function(req,res){
    //update take should only be possible for the user signed in 
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id ,{name:req.body.name,email:req.body.email},function(err){
    //         if(err){console.log("failed to update deets of user");return;}   
    //         req.flash("success" , "Successfully updated details.")
    //         return res.redirect("/");
    //     })

    // Implementing async await since it could get complicated
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            user.name = req.body.name;
            user.email = req.body.email;
            if(req.file){
                if(user.avatar){
                    let current_path = path.join(__dirname,'..',user.avatar);
                    if(fs.existsSync(current_path)){
                        fs.unlinkSync(current_path);
                        console.log(current_path);
                    }   
                }
                user.avatar = User.avatarPath + "/" + req.file.filename;
            }
            user.save();
            return res.redirect('back');
       }catch(err){
            req.flash("error" , 'This is an error');
            res.redirect('back');
        }
    }else{
        req.flash("error","You are unauthorized");
        return res.status(401).send("Unauthorized IP has been noted");
    }
};

module.exports.enterForgotPasswordMail = function(req,res){
    return res.render('forgot-password-enter-mail.ejs',{title:"Enter mail"});
}

module.exports.sendForgotPasswordMail = async function(req,res){
    let user =await User.find({email:req.body.email});
    if(!user){
        req.flash("error","This Email is not registered with us");
        return res.redirect("/users/sign-up");
    }
    let token = crypto.randomBytes(20).toString('hex');
    console.log(user);
    let newForgotPasswordEntry = await ForgotPasswordTokens.create({accessToken:token ,user: user[0]._id, isValid:true},function(err,entry){
        if(err){console.log("Couldnt create entry",err);return;}
        console.log("Entry is",entry);
        entry.populate({path:'user'}).execPopulate(function(err,entry){
            //send Email to user
            forgotPasswordMailer.forgotPassword(entry);
            return res.redirect("/users/signIn")
        })  
    });
    
};

module.exports.resetPassword = async function(req,res){
    let accessToken = req.query.accessToken;
    console.log(accessToken);
    ForgotPasswordTokens.findOne({accessToken:accessToken},function(err,entry){
        console.log(entry);
        return res.render("reset_password.ejs" ,{userAndTokenData:entry,title:entry.accessToken});
    });
    
}

module.exports.resetPasswordConfirm = async (req,res)=>{
    
    if(req.body.password != req.body.confirm_password){
        return res.redirect("back");
    }
    console.log("Finding entery");
    let entry = await ForgotPasswordTokens.findOne({accessToken:req.query.accessToken});
    if(!entry.isValid){
        return res.redirect("/");
    }
    console.log(entry);
    let user =await User.findById({_id:entry.user});
    if(user){
        user.password = req.body.password;
        user.save();
    }
    entry.isValid = false;
    await entry.save();
    return res.redirect("/users/signIn");
};

module.exports.likePost = async (req,res)=>{
    if(req.xhr){
        console.log("ATLEAST REACHED THE CONTROLLER");
        console.log("*********",req.body.post_id,"******");
    let like = await Likes.findOne({user:req.user._id , parent: mongoose.Types.ObjectId(req.body.post_id)});
    if(like){
        if(req.xhr){
            let likeId = like._id;
            let p = await Post.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.post_id)},{$pull:{likes: likeId}});
            p.save();
            let a = await Likes.findOneAndDelete({user:req.user._id , parent: mongoose.Types.ObjectId(req.body.post_id)});
            return res.json(200, {
                data:{
                    likeCount : p.likes.length-1,
                    message:"Successfully Unliked",
                    post_id: p.id
                }
            })
        }
    }else{
        if(req.xhr){
            let like = await Likes.create({user:req.user._id , parent: mongoose.Types.ObjectId(req.body.post_id) , parentType:"Post"});
            let p = await Post.findOne({_id:mongoose.Types.ObjectId(req.body.post_id)});
            p.likes.push(like._id);
            p.save();
            return res.json(200, {
                data:{
                    likeCount : p.likes.length,
                    message:"Successfuly Liked",
                    post_id: p.id
                }
            })
        }
    }
}
}