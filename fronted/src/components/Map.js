import React, { useEffect } from "react";
import "./Map.css";

const Map = ({ locations }) => {
  useEffect(() => {
    // Initialize map here using a library like Leaflet or Google Maps API
  }, [locations]);

  return (
    <div id="map" className="map">
      {/* Map will render here */}
    </div>
  );
};

export default Map;
