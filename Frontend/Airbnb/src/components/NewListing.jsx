import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function NewListing({listings,setListings}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image:{
      filename: 'listingimage',
      url:''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if(name === 'imageUrl'){
      setFormData({...formData,
        image:{
          ...formData.image,
          url: value
        }
      });
    }else{
      setFormData({...formData, [name]: value});
    }
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:3000/listings', formData);
      console.log("Listing created successfully", response.data);
      setListings([...listings, response.data]);
      navigate('/');
    }catch(err){
      console.error("Error creating listing", err);
      alert("Error creating listing: " + err.message);
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.image.url}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Listing
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewListing;

