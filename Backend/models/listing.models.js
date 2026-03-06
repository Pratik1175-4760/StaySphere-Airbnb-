const mongoose = require('mongoose');
const Review = require('./review.models.js');

const listingSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: true
    },
    description:{
      type: String,
      required: true
    },
    price:{
      type: Number,
      required: true
    },
    image: {
      url: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      }
    },
    location:{
      type: String,
      required: true
    },
    country:{
      type: String,
      required: true
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {timestamps: false}
);

// Middleware to delete image from Cloudinary when listing is deleted
listingSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc.image && doc.image.filename) {
    const { cloudinary } = require('../config/cloudinary.config.js');
    await cloudinary.uploader.destroy(doc.image.filename);
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;