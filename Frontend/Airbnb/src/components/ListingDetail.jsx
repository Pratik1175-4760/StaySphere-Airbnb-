import React, {useState, useEffect} from 'react'
import {useParams , Link} from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function ListingDetail({listings,setListings}) {
  const {id} = useParams();
  const [listing,setListing] = useState(null);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

    const handleDelete = async () => 
    {
      const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
      if (!confirmDelete) return;

      try {
        await axios.delete(`http://localhost:3000/listings/${id}`);
        navigate("/"); // go back after delete
        setListings(listings.filter(item => item._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete listing");
      }
    };

    const handleEdit = () =>{
      try{
        axios.get(`http://localhost:3000/listings/${id}/edit`);
        navigate(`/listing/${id}/edit`);
      }catch(err){
        console.error(err);
        alert("Failed to load edit page");
      }
    }

  useEffect(()=>{
    axios.get(`http://localhost:3000/listings/${id}`)
    .then((res)=>{
      setListing(res.data);
      setLoading(false);
    })
    .catch((err)=>{
      console.error(err);
      setLoading(false);
    })
  },[id]);

  if(loading){
    return <p>Loading...</p>
  }
  if(!listing){
    return <p>Listing not found</p>
  }

  return(
    <div>
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="mb-4">{listing.description}</p>
      <p className="mb-4">Price: ${listing.price}</p>
      <p className="mb-4">Location: {listing.location}, {listing.country}</p>
      <Link to="/">Back to Listings</Link>
      <button
        onClick={handleEdit}
        className="inline-block mt-4 ml-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Edit Listing
      </button>
      <button
        onClick={handleDelete}
        className="inline-block mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Listing
      </button>
    </div>
  );
}


export default ListingDetail
