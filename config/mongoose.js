const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/UserData2");

const db = mongoose.connection;

db.on("error" ,function(){console.error("The database could not be created");});
db.once('open',function(){
    console.log("Successfuly connected to the database");
});

module.exports = db;