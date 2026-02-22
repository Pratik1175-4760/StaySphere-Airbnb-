import React, { useState } from "react";
import axios from "axios";
import FlashMessage from './FlashMessage';

function Review({ listingId, reviews, onReviewAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ message: '', type: '' });

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setFlashMessage({ 
        message: 'Please select a rating', 
        type: 'error' 
      });
      return;
    }

    if (comment.trim().length < 5) {
      setFlashMessage({ 
        message: 'Comment must be at least 5 characters', 
        type: 'error' 
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/listings/${listingId}/reviews`,
        {
          rating,
          comment,
        }
      );

      onReviewAdded(response.data.review);

      setRating(0);
      setComment("");
      setShowForm(false);

      setFlashMessage({ 
        message: response.data.message || 'Review submitted successfully!', 
        type: 'success' 
      });
    } catch (err) {
      console.error(err);
      setFlashMessage({ 
        message: err.response?.data?.error || 'Failed to submit review', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/listings/${listingId}/reviews/${reviewId}`
      );

      onReviewAdded(null, reviewId);

      setFlashMessage({ 
        message: response.data.message || 'Review deleted successfully!', 
        type: 'success' 
      });
    } catch (err) {
      console.error(err);
      setFlashMessage({ 
        message: err.response?.data?.error || 'Failed to delete review', 
        type: 'error' 
      });
    }
  };

  // Average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <FlashMessage 
        message={flashMessage.message} 
        type={flashMessage.type}
        onClose={() => setFlashMessage({ message: '', type: '' })}
      />

      <div className="mt-12">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-3">

            <i className="fa-solid fa-star text-yellow-400 text-xl"></i>

            <span className="text-xl font-semibold">
              {averageRating > 0 ? averageRating : "New"}
            </span>

            <span className="text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>

          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Write Review
            </button>
          )}

        </div>


        {/* FORM */}
        {showForm && (
          <div className="border rounded-xl p-6 mb-8 bg-gray-50">

            <h3 className="font-semibold mb-4 text-lg">
              Share your experience
            </h3>

            <form onSubmit={handleSubmit}>

              {/* Stars */}
              <div className="mb-4 flex gap-1">

                {[1,2,3,4,5].map((star) => (

                  <i
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`fa-solid fa-star text-2xl cursor-pointer transition ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  ></i>

                ))}

              </div>


              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review"
                className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-rose-500 outline-none"
                rows="4"
              />


              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg transition"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setComment("");
                  }}
                  className="border px-5 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}



        {/* REVIEW LIST */}
        <div className="space-y-6">

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <i className="fa-regular fa-comment-dots text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          )}


          {reviews.map((review) => (

            <div
              key={review._id}
              className="border rounded-xl p-5 hover:shadow-md transition"
            >

              <div className="flex justify-between">

                <div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-1">

                    {[1,2,3,4,5].map((star) => (

                      <i
                        key={star}
                        className={`fa-solid fa-star ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      ></i>

                    ))}

                  </div>


                  {/* Date */}
                  <div className="text-gray-500 text-sm mb-2">

                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}

                  </div>


                  {/* Comment */}
                  <div className="text-gray-800">
                    {review.comment}
                  </div>

                </div>


                {/* Delete */}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Delete review"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}

export default Review;