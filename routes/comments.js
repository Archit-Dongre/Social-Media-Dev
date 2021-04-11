const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const passport = require("passport")

//putting an authentication check before creation of post so somebody dosent manually create
//another form and send to my post link 
router.post("/createComment" ,passport.checkAuthentication, commentsController.createComment);
router.get("/destroy/:id",passport.checkAuthentication,commentsController.destroy);
module.exports = router;