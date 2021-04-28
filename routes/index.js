const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController.js");


// lets do the above function of populating posts , users and rendering the home page in async await fashion 

router.get("/",homeController.home);
router.use("/users" , require("./users"));

// setting up api route
router.use('/api' , require('./api'));

module.exports = router;