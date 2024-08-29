import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/JourneyCard.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import WeatherWidget from "../components/WeatherWidget";

// Ensure to set default icon
delete L.Icon.Default.prototype._getIconUrl;

function JourneyPage() {
  const { id } = useParams();
  const [journey, setJourney] = useState({});
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    // Fetch the journey by id from the server
    fetch(`/api/journeys/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setJourney(data);

        // Set the location coordinates based on the journey data
        if (data.location) {
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${data.location}`
          )
            .then((res) => res.json())
            .then((locationData) => {
              if (locationData.length > 0) {
                const { lat, lon } = locationData[0];
                setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setLocationFetched(true);
              }
            })
            .catch((error) =>
              console.error("Error fetching location data:", error)
            );
        }
      })
      .catch((error) => console.error("Error fetching journey:", error));
  }, [id]);

  const CenterMap = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom()); // Update the map's center
    return null;
  };

  if (!locationFetched) {
    return <div>Loading...</div>;
  }

  // Custom icon URL
  const customIcon = L.icon({
    iconUrl: "C:Users\\noayawander-map\\fronted\\public\\img\\icon.png", // Path to your custom icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor position of the icon
    popupAnchor: [0, -32], // Popup anchor position
  });

  return (
    <div className="journey-page">
      <h1>{journey.title}</h1>
      <p>{journey.description}</p>

      <div className="journey-images">
        {journey.image_filename && (
          <img src={`/uploads/${journey.image_filename}`} alt="Journey" />
        )}
      </div>
      <div className="weather">
        <WeatherWidget location={location} />
      </div>
      <div className="journey-map">
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CenterMap center={location} />
          <Marker position={location} icon={customIcon}>
            <Popup>{journey.location}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default JourneyPage;
