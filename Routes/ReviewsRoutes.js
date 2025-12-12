const express = require("express");
const router = express.Router();
const ReviewsController = require("../Controller/ReviewsController");

router.put("/reviews/:id", ReviewsController.update);
router.delete("/reviews/:id", ReviewsController.delete);

module.exports = router;
