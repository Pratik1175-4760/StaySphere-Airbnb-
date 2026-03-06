const Listing = require('../models/listing.models.js');
const Review = require('../models/review.models.js');
const { cloudinary } = require('../config/cloudinary.config.js');

// GET all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({})
      .populate('owner', 'username');

    res.json(listings);
  } catch (err) {
    res.status(500).json({
      error: "Error fetching listings"
    });
  }
};

// GET single listing
exports.getListingById = async (req, res) => {
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
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    // check ownership
    const isOwner =
      req.user &&
      listing.owner._id.toString() === req.user.userId;

    // add ownership to reviews
    const reviewsWithOwnership =
      listing.reviews.map(review => ({
        ...review.toObject(),
        isOwner:
          req.user &&
          review.owner._id.toString() === req.user.userId
      }));

    res.json({
      ...listing.toObject(),
      reviews: reviewsWithOwnership,
      isOwner
    });

  } catch (err) {
    res.status(404).json({
      error: "Listing not found"
    });
  }
};

// CREATE listing (WITH IMAGE UPLOAD)
exports.createListing = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: "Image is required" 
      });
    }

    const { title, description, price, location, country } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location || !country) {
      // Delete uploaded image if validation fails
      await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    // Create listing with uploaded image
    const newListing = new Listing({
      title,
      description,
      price: Number(price),
      location,
      country,
      image: {
        url: req.file.path,           // Cloudinary URL
        filename: req.file.filename   // Cloudinary public_id
      },
      owner: req.user.userId
    });

    await newListing.save();

    res.status(201).json({
      message: 'Listing created successfully!',
      listing: newListing
    });

  } catch (err) {
    // Delete uploaded image if error occurs
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(400).json({
      error: "Error creating listing: " + err.message
    });
  }
};

// UPDATE listing (WITH IMAGE UPLOAD)
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      // Delete uploaded image if listing not found
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    // ownership check
    if (listing.owner.toString() !== req.user.userId) {
      // Delete uploaded image if not authorized
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(403).json({
        error: "You don't have permission to edit this listing"
      });
    }

    const { title, description, price, location, country } = req.body;

    // Update basic fields
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (location) listing.location = location;
    if (country) listing.country = country;

    // Update image if new one was uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(listing.image.filename);

      // Update with new image
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();

    res.json({
      message: 'Listing updated successfully!',
      listing
    });

  } catch (err) {
    // Delete uploaded image if error occurs
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(400).json({
      error: "Error updating listing: " + err.message
    });
  }
};

// DELETE listing (WITH IMAGE DELETION)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    // ownership check
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "You don't have permission to delete this listing"
      });
    }

    // Delete image from Cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Delete listing
    await Listing.findByIdAndDelete(req.params.id);

    // Delete associated reviews
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });

    res.json({
      message: "Listing and reviews deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: "Error deleting listing"
    });
  }
};