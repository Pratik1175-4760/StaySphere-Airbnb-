const express = require("express");

const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/review.controller.js");

const { authenticateToken } = require("../middleware/auth.middlewares.js");

// CREATE review
router.post("/", authenticateToken, reviewController.createReviews);

// DELETE review
router.delete("/:reviewId", authenticateToken, reviewController.deleteReview);

module.exports = router;
