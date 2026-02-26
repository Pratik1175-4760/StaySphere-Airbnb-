import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Review from './Review.jsx';

function ListingDetail({onDelete}) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchListing = () => {
    axios.get(`http://localhost:3000/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
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
      setListing(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r._id !== deletedReviewId)
      }));
    } else {
      setListing(prev => ({
        ...prev,
        reviews: [...prev.reviews, newReview]
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
        <Link to="/" className="text-rose-500 hover:underline mt-4 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  const isOwner = listing.isOwner;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i>
        <span>Back to listings</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{listing.title}</h1>

      <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
        {listing.image?.url ? (
          <img 
            src={listing.image.url} 
            className="w-full h-full object-cover" 
            alt={listing.title} 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <i className="fa-regular fa-image text-6xl text-gray-400"></i>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <i className="fa-solid fa-location-dot text-rose-500"></i>
          <span className="text-lg">{listing.location}, {listing.country}</span>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{listing.description}</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-3xl font-bold text-gray-900">₹ {listing.price}</span>
          <span className="text-gray-500 text-lg"> / night</span>
        </div>
        
        {isOwner && (
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

      <Review 
        listingId={id} 
        reviews={listing.reviews || []} 
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
}

export default ListingDetail;