// client/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="navbar">
      <h1>Okai</h1>
      <ul>
        <li><Link to="/feed">Feed</Link></li>
        <li><Link to={`/profile/${user._id}`}>Profile</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
