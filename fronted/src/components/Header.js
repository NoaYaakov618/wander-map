import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ isAuthenticated, username, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout(); // Call the passed logout function
    navigate("/"); // Redirect to the homepage after logging out
  };

  return (
    <header className="header">
      <div className="navbar">
        <Link to="/">Home</Link>

        {isAuthenticated ? (
          <>
            <Link to="/create">Create Journey</Link>
            <Link to={`/profile`}>Profile</Link>
            <Link onClick={handleLogout} className="logout-button">
              Logout
            </Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
