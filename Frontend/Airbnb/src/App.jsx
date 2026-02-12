import React from 'react'
import {Routes, Route, Link} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
import ListingDetail from './components/ListingDetail'
import EditListing from './components/EditListing'
import NewListing from './components/NewListing'
import Navbar from './Navbar'
import Footer from './Footer'

function App() {
  const [listings,setListings] = useState([]);
  
  useEffect(()=>{
    axios.get("http://localhost:3000/listings")
    .then((res)=>{
      setListings(res.data);
    })
    .catch((err)=>{
      console.error(err);
    })
  },[]);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-8">All Listings</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((item, index) => (
                  <Link 
                    to={`/listing/${item._id}`} 
                    key={index}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                      {item.image?.url ? (
                        <img 
                          src={item.image.url} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.location}, {item.country}
                      </p>
                      <div className="flex items-baseline space-x-1">
                        <span className="font-semibold text-gray-900">₹ {item.price}</span>
                        <span className="text-sm text-gray-500">/ night</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          } />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/listing/:id/edit" element={<EditListing />} />
          <Route path="/new" element={<NewListing />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App