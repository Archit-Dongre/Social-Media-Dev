const mongoose = require("mongoose");
const env = require("./environment");
mongoose.connect("mongodb://localhost/"+env.db);

const db = mongoose.connection;

db.on("error" ,function(){console.error("The database could not be created");});
db.once('open',function(){
    console.log("Successfuly connected to the database");
});

module.exports = db;