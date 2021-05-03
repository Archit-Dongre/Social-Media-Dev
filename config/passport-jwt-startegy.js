const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial' 
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            console.log("Error in finding user from JWT");
            return done(err, false);
        }
        if (user) {
            console.log("Working");
            return done(null, user);
        } else {
            console.log('Not working');
            return done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = passport;
