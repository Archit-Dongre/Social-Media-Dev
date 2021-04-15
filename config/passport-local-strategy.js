const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const User = require("../models/user");


passport.use(new LocalStrategy(    {usernameField:'email',passReqToCallback:true},
    function(req,email,password,done){

        User.findOne({email:email},function(err,user){
            if(err){
                console.log("Error in finding user --> Passport");
                return done(err);
            }

            //user not found or password incorrect

            if(!user || user.password != password){
                //console.log("Username/Password incorrect");
                req.flash("error","Invalid Username/Password");
                return done(null,false);
            }

            //user found
            //done takes two arguments first is error , second is authentication
            return done(null , user);
        })
    }
));

//serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});




// deserilaizing user from the key in the cookie

passport.deserializeUser(function(id , done){
    User.findById(id,function(err,user){
        if(err){console.log("Error in finding user");return done(err)};
        return done(null,user);
    })
});

//check if the user is authenticated

passport.checkAuthentication = function(req,res,next){
    // if the user is signed in then pass on the request to the next function 
    //which is my controllers action or function written in user.js after mentioning this middleware
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not signed in 
    req.flash("error","Please sign in first");
    return res.redirect("/users/signIn");

}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie
        //and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}
//export passport

module.exports = passport;
passport.s