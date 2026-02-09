import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: {
      filename: 'listingimage',
      url: ''
    }
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/listings/${id}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Error loading listing');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'imageUrl') {
      setFormData({
        ...formData,
        image: { ...formData.image, url: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/listings/${id}`, formData);
      navigate(`/listing/${id}`); 
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('Error updating listing. Please try again.');
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all";

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-gray-500 font-medium italic">
      Loading listing data...
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Listing</h1>
        <p className="text-gray-500 mb-8">Update your property information below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Price per night ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.image.url}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#FF385C] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#E31C5F] active:scale-95 transition-all shadow-md"
            >
              Update Listing
            </button>
            <button
              type="button"
              onClick={() => navigate(`/listing/${id}`)}
              className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-xl font-bold border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;