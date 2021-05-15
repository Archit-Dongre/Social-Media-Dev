const mongoose = require("mongoose");

const forgotPasswordTokenSchema = new mongoose.Schema({
    accessToken:{
        type: String,
        required:true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },
    isValid:{
        type:Boolean,
        required:true,
        
    }
},{
    timestamps:true
});

const ForgotPasswordTokens = mongoose.model("ForgotPasswordTokens" , forgotPasswordTokenSchema);
module.exports = ForgotPasswordTokens;