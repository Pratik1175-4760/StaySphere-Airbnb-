const express = require('express');
const router = express.Router({ mergeParams: true });  // Important for :id param
const Listing = require('../models/listings.models.js');
const Review = require('../models/review.models.js');
const Joi = require('joi');

// Joi Schema for review
const reviewSchema = Joi.object({
  comment: Joi.string().min(5).required(),
  rating: Joi.number().min(1).max(5).required(),
});

// POST create review
router.post('/', async (req, res) => {
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
      req.flash('error', 'Listing not found');
      return res.status(404).json({ error: "Listing not found" });
    }
    
    const newReview = new Review(value);
    await newReview.save();
    
    listing.reviews.push(newReview._id);
    await listing.save();
    
    // Set flash message
    req.flash('success', 'Review added successfully!');
    
    res.status(201).json({
      message: 'Review added successfully!',
      review: newReview
    });
  } catch (err) {
    req.flash('error', 'Error creating review');
    res.status(400).json({ error: "Error creating review: " + err.message });
  }
});

// DELETE review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    
    if (!deletedReview) {
      req.flash('error', 'Review not found');
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Set flash message
    req.flash('success', 'Review deleted successfully!');
    
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    req.flash('error', 'Error deleting review');
    res.status(500).json({ error: "Error deleting review" });
  }
});

module.exports = router;