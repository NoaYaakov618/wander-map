import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    about_me: "",
  });

  useEffect(() => {
    // Fetch user profile data from the server (using a mock fetch function here)
    fetch("/api/profile")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the updated profile data to the server (using a mock function here)
    fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile updated:", data);
        alert("Your profile has been updated successfully.");
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  console.log(user);

  return (
    <div className="profile-page">
      <h1>User: {user.username}</h1>
      <h4>about me:</h4>
      <p>
        {user.about_me
          ? user.about_me
          : "please update your bio to see it here"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">UserName</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            type="text"
            value={user.about_me}
            onChange={(e) => setUser({ ...user, about_me: e.target.value })}
          ></textarea>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
