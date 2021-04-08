const express = require("express");
const app = express();
const router = express.Router();
const port = 200;
const db = require("./config/mongoose");

// for layouts and partials
const expressLayouts = require("express-ejs-layouts");

//used for session cookie
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require('connect-mongo')(session);
const sassMiddelware = require("node-sass-middleware");

//use calls
app.use(sassMiddelware({
    src : "./assets/scss",
    dest:"./assets/css",
    debug:true,
    outputStyle: "expanded",
    prefix: "/css"
}))

app.use(expressLayouts);
app.use(express.urlencoded());
// for reading cookies
app.use(cookieParser());

//for reading the assets folder for css and js
app.use(express.static("assets"));

//for layouts and partials to use <%-style%> and <%-script%> auto detect
app.set('layout extractStyles' , true);
app.set('layout extractScripts' , true);

app.set("view engine" , "ejs");
app.set("views" , "./views");

//Mongo store is used to store the session cookie in the db
app.use(session({
    name: "practiceAuth",
    //TODO change secret before deployment in production
    secret:"blahsomething",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove: 'disabled'
    },function(err){
        console.log(err|| 'connect-mongodb setup ok for mongo store');
    })
}));

//use passport
app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use("/" , require("./routes/index.js"));

app.use("/" , require("./routes"));

app.listen(port , function(err){
    if(err){
        console.log("Unable to launch server");
        return ; 
    }
    console.log(`Server is up and running on port : ${port}`);
})

