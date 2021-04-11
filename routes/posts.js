const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const passport = require("passport")

//putting an authentication check before creation of post so somebody dosent manually create
//another form and send to my post link 
router.post("/createPost" ,passport.checkAuthentication, postsController.createPost);
router.get('/destroy',passport.checkAuthentication,postsController.destroy);
module.exports = router;