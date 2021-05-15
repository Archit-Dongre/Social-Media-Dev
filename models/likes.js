const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    parent:{
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'parentType'
    },
    parentType:{
        type:String,
        required:true,
        enum:["Post" , "Comment"]
    }
},{
    timestamps : true
});

const Likes = mongoose.model("Likes", LikesSchema);
module.exports = Likes;
