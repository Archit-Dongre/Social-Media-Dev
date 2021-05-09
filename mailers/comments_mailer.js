const nodemailer = require("../config/nodemailer");

module.exports.newComment = (comment)=>{
    console.log("inside new comment mailer");
    nodemailer.transporter.sendMail({
        from:"practiceAuth@notif.com",
        to: 'dongrearchit@gmail.com',
        subject : "New comment published",
        html: nodemailer.renderTemplate({comment:comment},'/comments/new_comment_mail.ejs')
    },(err,info)=>{
        if(err){console.log(err,"error in sending mail");return;}
        console.log("Mail delivered",info);
        return;
    })
}
