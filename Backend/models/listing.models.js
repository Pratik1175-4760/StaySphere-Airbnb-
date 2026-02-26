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
      filename: {
        type: String,
        required: true
      },
      url: {
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
    owner: {  // NEW FIELD
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

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;