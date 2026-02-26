const express = require('express');
const router = express.Router();
const Listing = require('../models/listings.models.js');
const { authenticateToken, optionalAuth } = require('../middleware/auth.js');

// GET all listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find({}).populate('owner', 'username');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching listings" });
  }
});

// GET single listing with owner check
router.get('/listings/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'owner',
          select: 'username'
        }
      })
      .populate('owner', 'username');
      
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check if current user is the listing owner
    const isOwner = req.user && listing.owner._id.toString() === req.user.userId;
    
    // Add isOwner flag to each review
    const reviewsWithOwnership = listing.reviews.map(review => ({
      ...review.toObject(),
      isOwner: req.user && review.owner._id.toString() === req.user.userId
    }));
    
    res.json({
      ...listing.toObject(),
      reviews: reviewsWithOwnership,
      isOwner
    });
  } catch (err) {
    res.status(404).json({ error: "Listing not found" });
  }
});

// POST create listing (PROTECTED)
router.post('/listings', authenticateToken, async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      owner: req.user.userId
    });
    
    await newListing.save();
    
    res.status(201).json({ 
      message: 'Listing created successfully!',
      listing: newListing 
    });
  } catch (err) {
    res.status(400).json({ error: "Error creating listing: " + err.message });
  }
});

// PUT update listing (PROTECTED - only owner)
router.put('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check ownership
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({ 
        error: "You don't have permission to edit this listing" 
      });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({ 
      message: 'Listing updated successfully!',
      listing: updatedListing 
    });
  } catch (err) {
    res.status(400).json({ error: "Error updating listing: " + err.message });
  }
});

// DELETE listing (PROTECTED - only owner)
router.delete('/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check ownership
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({ 
        error: "You don't have permission to delete this listing" 
      });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    
    const Review = require('../models/review.models.js');
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    
    res.json({ message: "Listing and reviews deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting listing" });
  }
});

module.exports = router;