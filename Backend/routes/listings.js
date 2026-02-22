const express = require('express');
const router = express.Router();
const Listing = require('../models/listings.models.js');
const Joi = require('joi');

// Joi Schema
const listingSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).required(),
  price: Joi.number().positive().max(1000000).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string().uri().required(),
  }).required(),
});

// GET all listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching listings" });
  }
});

// GET single listing with reviews
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    res.status(404).json({ error: "Listing not found" });
  }
});

// POST create listing
router.post('/listings', async (req, res) => {
  try {
    const { error, value } = listingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.details.map(d => d.message) 
      });
    }
    
    const newListing = new Listing(value);
    await newListing.save();
    
    // Set flash message
    req.flash('success', 'Listing created successfully!');
    
    res.status(201).json({ 
      message: 'Listing created successfully!',
      listing: newListing 
    });
  } catch (err) {
    req.flash('error', 'Error creating listing');
    res.status(400).json({ error: "Error creating listing: " + err.message });
  }
});

// PUT update listing
router.put('/listings/:id', async (req, res) => {
  try {
    const { error, value } = listingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.details.map(d => d.message) 
      });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      value, 
      { new: true, runValidators: true }
    );
    
    if (!updatedListing) {
      req.flash('error', 'Listing not found');
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Set flash message
    req.flash('success', 'Listing updated successfully!');
    
    res.json({ 
      message: 'Listing updated successfully!',
      listing: updatedListing 
    });
  } catch (err) {
    req.flash('error', 'Error updating listing');
    res.status(400).json({ error: "Error updating listing: " + err.message });
  }
});

// DELETE listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Delete associated reviews
    const Review = require('../models/review.models.js');
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    
    // Set flash message
    req.flash('success', 'Listing deleted successfully!');
    
    res.json({ message: "Listing and reviews deleted successfully" });
  } catch (err) {
    req.flash('error', 'Error deleting listing');
    res.status(500).json({ error: "Error deleting listing" });
  }
});

module.exports = router;