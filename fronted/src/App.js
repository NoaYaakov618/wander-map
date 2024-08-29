import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import JourneyPage from "./pages/JourneyPage";
import LogInPage from "./pages/LogInPage";
import CreateJourneyPage from "./pages/CreateJourneyPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

import "./styles/App.css";
// import styles from "./styles/App.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user.username);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header
          isAuthenticated={isAuthenticated}
          username={username}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey/:id" element={<JourneyPage />} />
          <Route path="/create" element={<CreateJourneyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LogInPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
