import React from 'react'
import {Routes, Route, Link, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
import ListingDetail from './components/ListingDetail'
import EditListing from './components/EditListing'
import Home from './components/Home'
import NewListing from './components/NewListing'
import SignUp from './components/Signup.jsx'
import Login from './components/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './Navbar'
import Footer from './Footer'


function App() {
  const [listings, setListings] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    axios.get("http://localhost:3000/listings")
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
  }, [location, refreshTrigger]);
  
  const refreshListings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home listings={listings} />} />
          <Route path="/listing/:id" element={<ListingDetail onDelete={refreshListings} />} />
          <Route path="/listing/:id/edit" element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          } />
          <Route path="/new" element={
            <ProtectedRoute>
              <NewListing />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  )
}

export default App