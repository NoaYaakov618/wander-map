import React, { useState, useEffect } from "react";
import JourneyCard from "../components/JourneyCard";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    // Fetch journeys from the server
    fetch("/api/journeys")
      .then((response) => response.json())
      .then((data) => setJourneys(data))
      .catch((error) => console.error("Error fetching journeys:", error));
  }, []);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete all data?")) {
      fetch("/api/delete", {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("All data deleted:", data);
          // Refresh the page to update the displayed data
          window.location.reload();
        })
        .catch((error) => console.error("Error deleting data:", error));
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome to the world of travel!</h1>
      <p>
        Here you can find people who are excited about nature, stories about
        experiences during a trip, exciting moments along the way, get to know
        new cultures and interesting people.
      </p>

      <p>We would love to hear your story too :)</p>
      <div className="journey-list">
        {journeys.map((journey) => (
          <Link key={journey.id} to={`/journey/${journey.id}`}>
            <div className="journey-card">
              <JourneyCard journey={journey} />
            </div>
          </Link>
        ))}
      </div>
      <button onClick={handleDelete}>Delete All Data</button>
    </div>
  );
}

export default HomePage;
