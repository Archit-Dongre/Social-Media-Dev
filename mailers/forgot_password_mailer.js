const nodemailer = require("../config/nodemailer");

module.exports.forgotPassword = (tokenEntry)=>{
    nodemailer.transporter.sendMail({
        from:'dongrearchit@gmail.com',
        to: 'dongrearchit@gmail.com',
        subject : "Forgot Password",
        html: nodemailer.renderTemplate({userAndTokenData:tokenEntry},'/forgot_password/forgot_password_mail.ejs')
    },(err,info)=>{
        if(err){console.log(err,"error in sending mail");return;}
        console.log("Mail delivered",info);
        return;
    })
}

