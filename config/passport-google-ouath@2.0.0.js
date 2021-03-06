const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");
// tell passport to use a new stategy for google login
passport.use(new googleStrategy(
{
    clientID: env.googleClientID,
    clientSecret: env.googleClientSecret,
    callbackURL:"http://localhost:200/users/auth/google/callback"
},
function(accessToken , refreshToken, profile ,done){
    // find a user
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log('Error in google strategy in passport',err);return}
        console.log(accessToken);
        console.log(profile);
        if(user){
            //if found set this user as req.user
            return done(null,user);
        }else{
            //if not create the user and set this user as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){console.log('Error in google strategy in passport',err);return}
                return done(null,user);
            })
        }
    })
}));

module.exports = passport;