const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log" , {
    interval:"1d",
    path:logDirectory
});

const development = {
    name:'development',
    db:"UserData2",
    emailAuthDetails:{
        user: process.env.user,
        pass: process.env.password,
    },
    googleClientID:"577107697766-peoh6ug57o3ak7itiinlkt83k469hpkn.apps.googleusercontent.com",
    googleClientSecret:"zFlaQG4tcs9qBBXhDMDK7iu-",
    jwtSecretKey: 'codeial',
    sessionCookieSecret:"blahsomething",
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    },
    assetPath : "./assets"

};

const production = {
    name:process.env.name,
    db:process.env.db,
    emailAuthDetails:{
        user: process.env.user,
        pass: process.env.pass,
    },
    googleClientID: process.env.googleClientID,
    googleClientSecret:process.env.googleClientSecret,
    jwtSecretKey: process.env.jwtSecretKey,
    sessionCookieSecret: process.env.sessionCookieSecret,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    },
    assetPath : "./public/assets"
};

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);