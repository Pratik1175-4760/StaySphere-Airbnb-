const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    comment:{
      type: String,
      required: true
    },
    rating:{
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },{timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;