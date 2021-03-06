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

router.get('/auth/google' , passport.authenticate('google',{scope:['profile','email']}));

router.get("/auth/google/callback" , passport.authenticate('google' , {failureRedirect:'/users/sign-in'}),usersController.createSession);

router.get("/forgot-password" , usersController.enterForgotPasswordMail);

router.post("/forgot-password-send-mail" , usersController.sendForgotPasswordMail);

router.get("/reset-password" , usersController.resetPassword);

router.post("/reset-password-confirm" , usersController.resetPasswordConfirm);

router.post("/like-post" , usersController.likePost);


module.exports = router;