const express = require("express");
const router = express.Router();


router.get("/" , function(req,res){
    res.render("home" , {title:"Home page"});
})

router.use("/users" , require("./users"));

module.exports = router;