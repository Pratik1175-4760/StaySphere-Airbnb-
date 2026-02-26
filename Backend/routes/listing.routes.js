const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.controller.js");

const {authenticateToken,optionalAuth} = require("../middleware/auth.middlewares.js");

router
  .route("/listings")
  .get(listingController.getAllListings)
  .post(authenticateToken, listingController.createListing)

router
  .route("/listings/:id")
  .get(optionalAuth, listingController.getListingById)
  .put(authenticateToken, listingController.updateListing)
  .delete(authenticateToken,listingController.deleteListing,
)

module.exports = router;
