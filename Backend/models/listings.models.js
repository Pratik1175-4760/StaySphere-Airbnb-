const mongoose = require('mongoose');

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
    }
  },
  {timestamps: false}
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;