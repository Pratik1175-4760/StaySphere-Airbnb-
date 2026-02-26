const Listing = require("../models/listing.models.js");
const Review = require("../models/review.models.js");

const { reviewSchema } = require("../validations/review.validations.js");

exports.createReviews = async (req, res) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: "Validation error",

        details: error.details.map((d) => d.message),
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    const newReview = new Review({
      ...value,

      owner: req.user.userId,
    });

    await newReview.save();

    listing.reviews.push(newReview._id);

    await listing.save();

    res.status(201).json({
      message: "Review added successfully!",

      review: newReview,
    });
  } catch (err) {
    res.status(400).json({
      error: "Error creating review: " + err.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // Find the review first
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if current user is the review owner
    if (review.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "You don't have permission to delete this review",
      });
    }

    // Remove review from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting review" });
  }
};
