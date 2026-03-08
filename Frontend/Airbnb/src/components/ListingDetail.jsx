import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Review from "./Review.jsx";
import MapboxMap from "./MapboxMap";

function ListingDetail({ onDelete }) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // SIMPLE SCROLL TO TOP - Only when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]); // Only depends on ID, not loading or listing

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/listings/${id}`);
      navigate("/");
      if (onDelete) onDelete();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const handleReviewAdded = (newReview, deletedReviewId) => {
    if (deletedReviewId) {
      setListing((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== deletedReviewId),
      }));
    } else {
      setListing((prev) => ({
        ...prev,
        reviews: [...prev.reviews, newReview],
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-rose-500 mb-4"></i>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <i className="fa-regular fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">Listing not found</p>
        <Link
          to="/"
          className="text-rose-500 hover:underline mt-4 inline-block"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors font-medium mb-6"
      >
        <i className="fa-solid fa-arrow-left text-sm"></i>
        <span>Back to listings</span>
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {listing.title}
      </h1>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-200">
        {listing.image?.url ? (
          <img
            src={listing.image.url}
            className="w-full h-full object-cover"
            alt={listing.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fa-regular fa-image text-6xl text-gray-400"></i>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <i className="fa-solid fa-location-dot text-rose-500"></i>
          <span className="text-lg">
            {listing.location}, {listing.country}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {listing.description}
        </p>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-3xl font-bold text-gray-900">
            ₹ {listing.price}
          </span>
          <span className="text-gray-500 text-lg"> / night</span>
        </div>

        {listing.isOwner && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/listing/${id}/edit`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
            >
              <i className="fa-solid fa-pen"></i>
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-all flex items-center space-x-2"
            >
              <i className="fa-solid fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Reviews */}
      <Review
        listingId={id}
        reviews={listing.reviews || []}
        onReviewAdded={handleReviewAdded}
      />

      {/* Map */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fa-solid fa-location-dot text-rose-500 mr-3"></i>
          Where you'll be
        </h2>
        <MapboxMap
          location={listing.location}
          country={listing.country}
          title={listing.title}
          price={listing.price}
          imageUrl={listing.image?.url}
        />
      </div>
    </div>
  );
}

export default ListingDetail;