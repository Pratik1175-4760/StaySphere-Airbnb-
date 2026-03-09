import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBed,
  faMountain,
  faWater,
  faTree,
  faSnowflake,
  faHouse,
  faUmbrellaBeach
} from "@fortawesome/free-solid-svg-icons";

function Home({ listings }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Update filter when search is cleared
  useEffect(() => {
    if (!searchQuery) {
      // Don't reset filter when search is cleared
    }
  }, [searchQuery]);

  const filters = [
    { id: "All", icon: faFire, label: "All" },
    { id: "Trending", icon: faFire, label: "Trending" },
    { id: "Rooms", icon: faBed, label: "Rooms" },
    { id: "Mountain", icon: faMountain, label: "Mountain" },
    { id: "Lake", icon: faWater, label: "Lake" },
    { id: "Camping", icon: faTree, label: "Camping" },
    { id: "Arctic", icon: faSnowflake, label: "Arctic" },
    { id: "Cabins", icon: faHouse, label: "Cabins" },
    { id: "Beach", icon: faUmbrellaBeach, label: "Beach" },
  ];

  // COMBINED FILTERING - Search + Category
  const filteredListings = listings.filter((listing) => {
    // First apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${listing.title} ${listing.description} ${listing.location} ${listing.country}`.toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Then apply category filter
    if (activeFilter === "All") return true;
    
    if (activeFilter === "Trending") {
      return listing.price > 3000;
    }
    
    return listing.category === activeFilter;
  });

  return (
    <div>
      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-magnifying-glass text-blue-600"></i>
              <p className="text-sm text-gray-700">
                Search results for: <strong className="text-gray-900">"{searchQuery}"</strong>
              </p>
            </div>
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        id="filters"
        className="flex items-center space-x-8 overflow-x-auto py-4 border-b mb-6 scrollbar-hide"
      >
        {filters.map((filter) => (
          <div
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex flex-col items-center cursor-pointer min-w-[70px] transition-all duration-200 ${
              activeFilter === filter.id
                ? "text-black scale-105"
                : "text-gray-600 hover:text-black hover:scale-105"
            }`}
          >
            <div className={`transition-all duration-200 ${
              activeFilter === filter.id ? "pb-0" : "pb-2"
            }`}>
              <FontAwesomeIcon icon={filter.icon} size="lg" />
            </div>
            <span className="text-sm mt-1 whitespace-nowrap font-medium">
              {filter.label}
            </span>
            {activeFilter === filter.id && (
              <div className="w-full h-0.5 bg-black mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Active Filter Display */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {searchQuery ? (
            <>Search Results</>
          ) : activeFilter === "All" ? (
            "All Listings"
          ) : (
            `${activeFilter} Listings`
          )}
          <span className="text-gray-500 text-base ml-2 font-normal">
            ({filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"})
          </span>
        </h2>
        
        {(activeFilter !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setActiveFilter("All");
              window.history.pushState({}, '', '/');
            }}
            className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* No Results Message */}
      {filteredListings.length === 0 && (
        <div className="text-center py-16">
          <FontAwesomeIcon 
            icon={faHouse} 
            size="4x" 
            className="text-gray-300 mb-4" 
          />
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? (
              <>No properties found for "{searchQuery}"</>
            ) : (
              <>No listings found for "{activeFilter}"</>
            )}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            {searchQuery ? (
              "Try searching for a different location or destination"
            ) : (
              "Try selecting a different category"
            )}
          </p>
          <Link
            to="/"
            onClick={() => setActiveFilter("All")}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors inline-block"
          >
            View all listings
          </Link>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.map((item) => (
          <Link
            to={`/listing/${item._id}`}
            key={item._id}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
              {item.image?.url ? (
                <img
                  src={item.image.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHouse} size="2x" className="text-gray-400" />
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                {item.category}
              </div>
            </div>

            {/* Listing Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {item.location}, {item.country}
              </p>

              <div className="flex items-baseline space-x-1">
                <span className="font-semibold text-gray-900">
                  ₹ {item.price}
                </span>
                <span className="text-sm text-gray-500">
                  / night
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;