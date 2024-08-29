import React, { useState } from "react";
import "../styles/CreateJourneyPage.css";
import { useNavigate } from "react-router-dom";

function CreateJourneyPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);

    if (image) {
      formData.append("image", image);
    }

    fetch("/api/journeys", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Journey created:", data);
        navigate("/");
      })
      .catch((error) => console.error("Error creating journey:", error));
  };

  // Handle input changes and fetch suggestions
  const handleChange = (e) => {
    const query = e.target.value;
    setLocation(query);
    fetchLocations(query);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name); // Use the selected location's display name
    setSuggestions([]);
  };

  // Fetch location suggestions from Nominatim API
  const fetchLocations = async (query) => {
    if (query.length > 2) {
      // Only fetch if the query is longer than 2 characters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="create-journey-page">
      <h1>Create a New Journey</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={handleChange}
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image (Optional)</label>
          <input
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Create Journey</button>
      </form>
    </div>
  );
}

export default CreateJourneyPage;
