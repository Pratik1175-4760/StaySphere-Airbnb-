import React, { useState, useEffect } from "react";
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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
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

  // Fix: prevent map from stealing focus
  const handleMapLoad = (event) => {
    const map = event.target;
    const canvas = map.getCanvas();

    if (canvas) {
      canvas.removeAttribute("tabindex");
      canvas.setAttribute("tabindex", "-1");
      canvas.style.outline = "none";

      canvas.addEventListener(
        "focus",
        (e) => {
          e.preventDefault();
          canvas.blur();
        },
        true
      );
    }
  };

  // Loading UI
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

  // Error UI
  if (error || !coordinates) {
    return (
      <div className="h-96 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <i className="fa-solid fa-location-dot text-4xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">{error || "Location unavailable"}</p>
          <p className="text-sm text-gray-400 mt-1">
            {location}, {country}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <Map
          initialViewState={{
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            zoom: 13,
          }}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={handleMapLoad}
          keyboard={false}
          dragRotate={false}
          touchPitch={false}
          reuseMaps
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          <Marker
            longitude={coordinates.lng}
            latitude={coordinates.lat}
            anchor="bottom"
          >
            <div className="text-rose-500 text-4xl cursor-pointer hover:scale-110 transition-transform">
              📍
            </div>
          </Marker>

          {showPopup && (
            <Popup
              longitude={coordinates.lng}
              latitude={coordinates.lat}
              anchor="top"
              closeOnClick={false}
              focusAfterOpen={false}
              onClose={() => setShowPopup(false)}
            >
              <div className="p-2 min-w-[200px]">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}

                <h3 className="font-bold text-sm mb-1">{title}</h3>

                <p className="text-xs text-gray-600 mb-2">
                  {location}, {country}
                </p>

                <p className="text-rose-600 font-semibold text-sm">
                  ₹{price} / night
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Location Info */}
      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
        <i className="fa-solid fa-circle-info text-gray-400 mt-1"></i>

        <div className="flex-1">
          <p className="text-sm text-gray-600">
            <strong>Exact location</strong> will be provided after booking confirmation.
          </p>

          <p className="text-sm text-gray-500 mt-1">
            📍 {location}, {country}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapboxMap;