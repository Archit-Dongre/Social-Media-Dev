const queue = require("../config/kue");

const comments_mailer = require("../mailers/comments_mailer");

queue.process('commentEmails',function(job,done){
    console.log("****Worker is processing a job ****");
    console.log(job.data);
    comments_mailer.newComment(job.data);
    done();
})
