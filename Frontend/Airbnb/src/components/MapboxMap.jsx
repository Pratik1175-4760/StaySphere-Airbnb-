import React, { useState, useEffect, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function MapboxMap({ location, country, title, price, imageUrl }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location && country) {
      geocodeLocation();
    }
  }, [location, country]);

  const geocodeLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const address = `${location}, ${country}`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setCoordinates({ lat, lng });
      } else {
        setError("Location not found");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Unable to load map");
    } finally {
      setLoading(false);
    }
  };

  // This is the "Nuclear" Focus Fix
  const preventFocus = useCallback((e) => {
    const canvas = e.target.getCanvas();
    canvas.setAttribute("tabindex", "-1"); // Remove from tab order
    canvas.blur(); // Force remove focus
    // If the map load caused a jump, this snaps it back instantly
    if (window.scrollY > 100) {
        window.scrollTo(0, 0);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-2"></i>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="h-96 bg-gray-50 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">{error || "Location unavailable"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ overflowAnchor: "none" }} 
      >
        <Map
          initialViewState={{
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            zoom: 13,
          }}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          
          /* --- ANTI-JUMP PROPS --- */
          onLoad={preventFocus}
          onIdle={preventFocus} 
          keyboard={false}         // Disable keyboard to prevent focus-seeking
          trackResize={false}      // Prevent map from calculating position on mount
          cooperativeGestures={true} // Prevents "scroll trap"
          /* ----------------------- */
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          <Marker longitude={coordinates.lng} latitude={coordinates.lat} anchor="bottom">
            <div className="text-rose-500 text-4xl cursor-pointer hover:scale-110 transition-transform">
              📍
            </div>
          </Marker>

          {showPopup && (
            <Popup
              longitude={coordinates.lng}
              latitude={coordinates.lat}
              anchor="top"
              onClose={() => setShowPopup(false)}
              closeOnClick={false}
              focusAfterOpen={false} // Built-in Mapbox prop to prevent popup focus jump
            >
              <div className="p-2 min-w-[200px]">
                {imageUrl && (
                  <img src={imageUrl} alt={title} className="w-full h-24 object-cover rounded mb-2" />
                )}
                <h3 className="font-bold text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-600 mb-2">{location}, {country}</p>
                <p className="text-rose-600 font-semibold text-sm">₹{price} / night</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}

export default MapboxMap;