import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LogInPage.css";
import { Link } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, remember_me: rememberMe }),
    });

    if (response.ok) {
      const result = await response.json();
      // Assuming the response contains a success flag or token
      if (result.success) {
        onLogin({ username });
        navigate(result.next || "/");
      } else {
        alert(result.message);
      }
    } else {
      alert("Error occurred during login.");
    }
  };

  return (
    <div className="log-in">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        <p>
          New User? <Link to="/register">Click to Register!</Link>
        </p>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;
