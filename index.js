const express = require("express");
const app = express();
const production_asset_path_helper = require("./config/view-helpers")(app);
const router = express.Router();
const port = 200;
const db = require("./config/mongoose");
const dotenv = require("dotenv");
dotenv.config();
// for layouts and partials
const expressLayouts = require("express-ejs-layouts");

//used for session cookie
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require('connect-mongo')(session);
const sassMiddelware = require("node-sass-middleware");

// for JWT authentication 
const passportJwt = require("./config/passport-jwt-startegy");

//for google auth
const passportGoogle = require("./config/passport-google-ouath@2.0.0");

const flash = require("connect-flash");
const flashMiddleware = require("./config/middleware");

//get development environment wether production or development

const env = require("./config/environment");

//getting our logger for logs

const logger = require("morgan");

//set up chat server to be used by socket io 
const chatServer = require('http').Server(app);
const chatSockets = require("./config/chat_socket").chatSockets(chatServer);
chatServer.listen(500);
console.log("Chat server is listening on port 500");


//set calls 

//for layouts and partials to use <%-style%> and <%-script%> auto detect
app.set('layout extractStyles' , true);
app.set('layout extractScripts' , true);

app.set("view engine" , "ejs");
app.set("views" , "./views");

//use calls 
if(env.name == 'development'){
    app.use(sassMiddelware({
        src : "./assets/scss",
        dest:"./assets/css",
        debug:true,
        outputStyle: "expanded",
        prefix: "/css"
    }))
}

app.use(expressLayouts);
app.use(express.urlencoded());
// for reading cookies
app.use(cookieParser());

//for reading the assets folder for css and js
app.use(express.static(env.assetPath));

// using static for making the avatar folder availaible to browser

app.use('/uploads' , express.static(__dirname+'/uploads'));

// use the logger for logging

app.use(logger(env.morgan.mode , env.morgan.options));

//Mongo store is used to store the session cookie in the db
app.use(session({
    name: "practiceAuth",
    //TODO change secret before deployment in production
    secret:env.sessionCookieSecret,
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

//using flash 
 
app.use(flash());
app.use(flashMiddleware.setFlash);


//setting up of routes
app.use("/" , require("./routes/index.js"));

//app.use("/" , require("./routes"));

app.listen(port , function(err){
    if(err){
        console.log("Unable to launch server");
        return ; 
    }
    console.log(`Server is up and running on port : ${port}`);
})

