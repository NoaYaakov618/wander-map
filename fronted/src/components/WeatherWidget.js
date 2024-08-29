import React, { useEffect, useState } from "react";
import "../styles/WeatherWidget.css";

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location.lat && location.lng) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&appid=954d5dcd4c64828720c1c3f211010601`
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
      {weather ? (
        <>
          <h4>{weather.name}</h4>
          <p>{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
