import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListingDetail({ listings, setListings }) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/listings/${id}`);
      setListings(listings.filter(item => item._id !== id));
      navigate("/");
    } catch (err) {
      alert("Delete failed",err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!listing) return <div className="text-center py-10">Not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{listing.title}</h1>
      <div className="rounded-2xl overflow-hidden mb-6 h-96">
        <img src={listing.image?.url} className="w-full h-full object-cover" alt={listing.title} />
      </div>
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Hosted in {listing.location}</h2>
        <p className="text-gray-600 leading-relaxed">{listing.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">${listing.price} / night</span>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/listing/${id}/edit`)} className="px-6 py-2 border border-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition">Edit</button>
          <button onClick={handleDelete} className="px-6 py-2 bg-[#FF385C] text-white rounded-lg font-semibold hover:bg-[#E31C5F] transition">Delete</button>
        </div>
      </div>
    </div>
  );
}
export default ListingDetail;