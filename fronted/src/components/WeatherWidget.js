import React, { useEffect, useState } from "react";
import "../styles/WeatherWidget.css";

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location.lat && location.lng) {
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location.lat},${location.lng}`
          );
          const data = await response.json();
          setWeather(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };
    fetchWeather();
  }, [location]);

  return (
    <div className="weather-widget">
      {weather && weather.location && weather.current ? (
        <>
          <h4>{weather.location.name}</h4>
          <p>
            {weather.current.temp_c}°C, {weather.current.condition.text}
          </p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
