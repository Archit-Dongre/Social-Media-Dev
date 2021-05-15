const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content:{
        type : String,
        required: true,
    } , 
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    //include ids of all comments on this post
    commentIds:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Likes'
        }
        
    ]
},{
    timestamps:true
});

const Post = mongoose.model("Post" , postSchema);
module.exports = Post;