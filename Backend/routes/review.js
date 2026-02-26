const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listings.models.js');
const Review = require('../models/review.models.js');
const { authenticateToken, optionalAuth } = require('../middleware/auth.js');
const Joi = require('joi');

// Joi Schema for review
const reviewSchema = Joi.object({
  comment: Joi.string().min(5).required(),
  rating: Joi.number().min(1).max(5).required(),
});

// POST create review (PROTECTED - must be logged in)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.details.map(d => d.message) 
      });
    }
    
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Create review with owner from JWT
    const newReview = new Review({
      ...value,
      owner: req.user.userId  // ← Add owner from JWT
    });
    
    await newReview.save();
    
    listing.reviews.push(newReview._id);
    await listing.save();
    
    res.status(201).json({
      message: 'Review added successfully!',
      review: newReview
    });
  } catch (err) {
    res.status(400).json({ error: "Error creating review: " + err.message });
  }
});

// DELETE review (PROTECTED - only owner can delete)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
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
        error: "You don't have permission to delete this review" 
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
});

module.exports = router;