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
    res.render("sign-in",{title:"Sign In"});
};

module.exports.create = function(req,res){

    if(req.body.password != req.body.confirm_password){
        console.log("Your passwords dont match G");
        res.redirect("back");
        return;
    }
    User.findOne({email:req.body.email} , function(err,user){
        if(err){console.log("Unable to create user");return;};
        console.log(user);
        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log("error in creating user");return;};
                return res.redirect("/users/signIn");
            })
        }else{
            console.log("Your user already exists");
            res.redirect("/users/signIn")
        }
    });


};

module.exports.profile =  function(req, res){
    //To be implemented with help of passport library
    res.render('user-profile',{title:"User profile"});
};

//use passport as a middleware to authenticate
module.exports.createSession = function(req,res){
    return res.redirect("/");
};

module.exports.signOut = function(req,res){
    req.logOut();
    res.redirect("/");
};

