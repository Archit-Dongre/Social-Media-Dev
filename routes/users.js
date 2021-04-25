const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const usersController = require("../controllers/user_controller");
const postsController = require("../controllers/postsController");

router.get("/signUp" , usersController.signUp);

router.get("/signIn" , usersController.signIn);

router.post("/signUp/create" , usersController.create);

router.post("/update/:id" ,passport.checkAuthentication,User.uploadAvatar,usersController.update);

router.get("/profile/:id",passport.checkAuthentication, usersController.profile);

//use passport as a middleware to authenticate
router.post("/signIn/create-session" ,passport.authenticate('local',
{failureRedirect:'/users/signIn'}) , usersController.createSession);

router.get("/signOut" , usersController.signOut)

router.use("/posts" , require("./posts"));

router.use("/comment" , require("./comments"));



module.exports = router;