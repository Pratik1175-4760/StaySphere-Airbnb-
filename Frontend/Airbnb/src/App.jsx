import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";
import ListingDetail from "./components/ListingDetail";
import NewListing from "./components/NewListing";
import EditListing from "./components/EditListing";

function App() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const handelNew = () => {
    try {
      axios.get("http://localhost:3000/listings/new");
      navigate("/new");
    } catch (err) {
      console.error(err);
      alert("Failed to load new listing page");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/listings")
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <div className="web-name">
              <h1 className="text-3xl font-bold">WonderLust</h1>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">Listings</h2>
            </div>
            <button
              onClick={handelNew}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create New Listing
            </button>
            {listings.map((item, index) => (
              <Link
                to={`/listing/${item._id}`}
                key={index}
                className="block mb-4 text-blue-600 hover:underline cursor-pointer"
              >
                {item.title}
              </Link>
            ))}
          </div>
        }
      />
      <Route
        path="/listing/:id"
        element={
          <ListingDetail listings={listings} setListings={setListings} />
        }
      />
      <Route
        path="/new"
        element={<NewListing listings={listings} setListings={setListings} />}
      />
      <Route
        path="/listing/:id/edit"
        element={<EditListing listings={listings} setListings={setListings} />}
      />
    </Routes>
  );
}

export default App;
