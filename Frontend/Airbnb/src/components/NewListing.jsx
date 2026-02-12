import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewListing() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 5) return 'Title must be at least 5 characters';
        if (value.length > 100) return 'Title must be less than 100 characters';
        return '';
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 20) return 'Description must be at least 20 characters';
        return '';
      
      case 'price':
        if (!value) return 'Price is required';
        if (value <= 0) return 'Price must be greater than 0';
        if (value > 1000000) return 'Price seems too high';
        return '';
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        return '';
      
      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';
      
      case 'imageUrl':
        if (!value.trim()) return 'Image URL is required';
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'imageUrl') {
      setFormData({
        ...formData,
        image: { ...formData.image, url: value }
      });
      const error = validateField('imageUrl', value);
      setErrors({ ...errors, imageUrl: error });
    } else {
      setFormData({ ...formData, [name]: value });
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      price: validateField('price', formData.price),
      location: validateField('location', formData.location),
      country: validateField('country', formData.country),
      imageUrl: validateField('imageUrl', formData.image.url),
    };
    
    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      price: true,
      location: true,
      country: true,
      imageUrl: true,
    });
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      alert('Please fix all errors before submitting');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/listings', formData);
      alert('Listing created successfully!');
      navigate('/');
    } catch (err) {
      console.error("Error creating listing", err);
      alert("Error creating listing: " + err.message);
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-xl outline-none transition-all placeholder:text-gray-400";
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName === 'imageUrl' ? 'image' : fieldName];
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50`;
    } else if (isValid) {
      return `${baseClasses} border-green-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 bg-green-50`;
    } else {
      return `${baseClasses} border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-rose-100 p-3 rounded-xl">
            <i className="fa-solid fa-house-chimney text-rose-600 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Host your home</h1>
            <p className="text-gray-500">Share your space with travelers worldwide</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
              Title
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Cozy Beachfront Cottage"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
              className={getInputClasses('title')}
            />
            {touched.title && errors.title && (
              <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{errors.title}</span>
              </div>
            )}
            {touched.title && !errors.title && formData.title && (
              <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                <i className="fa-solid fa-circle-check"></i>
                <span>Looks good!</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
              Description
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              placeholder="What makes your place special? Describe the amenities, location, and experience guests can expect..."
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              rows="4"
              className={getInputClasses('description')}
            />
            {touched.description && errors.description && (
              <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{errors.description}</span>
              </div>
            )}
            {touched.description && !errors.description && formData.description && (
              <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                <i className="fa-solid fa-circle-check"></i>
                <span>Great description!</span>
              </div>
            )}
          </div>

          {/* Price and Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-indian-rupee-sign mr-2 text-rose-500"></i>
                Price per night
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="1500"
                value={formData.price}
                onChange={handleChange}
                onBlur={() => handleBlur('price')}
                className={getInputClasses('price')}
              />
              {touched.price && errors.price && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.price}</span>
                </div>
              )}
              {touched.price && !errors.price && formData.price && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Valid price</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-image mr-2 text-rose-500"></i>
                Image URL
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.image.url}
                onChange={handleChange}
                onBlur={() => handleBlur('imageUrl')}
                className={getInputClasses('imageUrl')}
              />
              {touched.imageUrl && errors.imageUrl && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.imageUrl}</span>
                </div>
              )}
              {touched.imageUrl && !errors.imageUrl && formData.image.url && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Valid URL</span>
                </div>
              )}
            </div>
          </div>

          {/* Location and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-location-dot mr-2 text-rose-500"></i>
                Location
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Malibu"
                value={formData.location}
                onChange={handleChange}
                onBlur={() => handleBlur('location')}
                className={getInputClasses('location')}
              />
              {touched.location && errors.location && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.location}</span>
                </div>
              )}
              {touched.location && !errors.location && formData.location && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Valid location</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center">
                <i className="fa-solid fa-earth-americas mr-2 text-rose-500"></i>
                Country
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="country"
                placeholder="e.g. United States"
                value={formData.country}
                onChange={handleChange}
                onBlur={() => handleBlur('country')}
                className={getInputClasses('country')}
              />
              {touched.country && errors.country && (
                <div className="flex items-center space-x-2 text-red-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errors.country}</span>
                </div>
              )}
              {touched.country && !errors.country && formData.country && (
                <div className="flex items-center space-x-2 text-green-600 text-sm ml-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Valid country</span>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {formData.image.url && !errors.imageUrl && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Preview</label>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <img 
                  src={formData.image.url} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setErrors({ ...errors, imageUrl: 'Failed to load image. Please check the URL.' });
                  }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-rose-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-check"></i>
              <span>Create Listing</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewListing;