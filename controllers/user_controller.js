const User = require("../models/user");
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

module.exports.update = function(req,res){
    //update take should only be possible for the user signed in 
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id ,{name:req.body.name,email:req.body.email},function(err){
            if(err){console.log("failed to update deets of user");return;}   
            req.flash("success" , "Successfully updated details.")
            return res.redirect("/");
        })
    }else{
        req.flash("error","You are unauthorized");
        return res.status(401).send("Unauthorized IP has been noted");
    }
};