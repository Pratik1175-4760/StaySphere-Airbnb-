const express = require('express');

const router = express.Router();

const listingController =
require('../controllers/listing.controller.js');

const {
  authenticateToken,
  optionalAuth
} = require('../middleware/auth.middlewares.js');



// GET all listings
router.get(
  '/listings',
  listingController.getAllListings
);


// GET single listing
router.get(
  '/listings/:id',
  optionalAuth,
  listingController.getListingById
);


// CREATE listing
router.post(
  '/listings',
  authenticateToken,
  listingController.createListing
);


// UPDATE listing
router.put(
  '/listings/:id',
  authenticateToken,
  listingController.updateListing
);


// DELETE listing
router.delete(
  '/listings/:id',
  authenticateToken,
  listingController.deleteListing
);


module.exports = router;