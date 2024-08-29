import React from "react";
import "../styles/JourneyCard.css";

const JourneyCard = ({ journey }) => {
  return (
    <div className="journey-card">
      {journey.image_filename && (
        <img src={`/uploads/${journey.image_filename}`} alt="Journey" />
      )}
      <h2>{journey.title}</h2>
      <p>{journey.description}</p>
    </div>
  );
};

export default JourneyCard;
