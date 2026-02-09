import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewListing({ listings, setListings }) {
  const navigate = useNavigate();
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
      const response = await axios.post('http://localhost:3000/listings', formData);
      setListings([...listings, response.data]);
      navigate('/');
    } catch (err) {
      console.error("Error creating listing", err);
      alert("Error creating listing: " + err.message);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Host your home</h1>
        <p className="text-gray-500 mb-8">Fill in the details to create a new listing on StaySphere.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Modern Apartment with Sea View"
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
              placeholder="What makes your place special?"
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
                placeholder="100"
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
                placeholder="https://images.unsplash.com/..."
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
                placeholder="e.g. Manhattan, NY"
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
                placeholder="e.g. United States"
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
              Create Listing
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
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

export default NewListing;