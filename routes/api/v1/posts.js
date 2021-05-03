const express = require("express");
const router = express.Router();
const postApiController = require("../../../controllers/api/v1/posts_api");
const passport = require('passport');

router.get('/' , postApiController.index);
router.delete('/:id' , passport.authenticate('jwt',{session: false}) , postApiController.destroy);

module.exports = router;