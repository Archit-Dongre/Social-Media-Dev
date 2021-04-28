const express = require("express");
const router = express.Router();
const postApiController = require("../../../controllers/api/v1/posts_api");

router.get('/' , postApiController.index);
router.delete('/:id' , postApiController.destroy);

module.exports = router;