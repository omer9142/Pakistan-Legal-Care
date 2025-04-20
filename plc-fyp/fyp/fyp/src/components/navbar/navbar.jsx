import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import NavbarImage from "../../assets/Logo.png";
import E_DP from "../../assets/empty_dp.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setIsLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching user:", err));

      fetch("http://localhost:5000/user/role", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser((prevUser) => ({ ...prevUser, role: data.role }));
        })
        .catch((err) => console.error("Error fetching user role:", err));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <div
          className="navbar-logo"
          style={{ backgroundImage: `url(${NavbarImage})` }}
        />
      </Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Attorneys">Attorneys</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <div className="user-info" ref={dropdownRef}>
            <img
              src={user?.profileImage ? `/assets/${user.profileImage}` : E_DP}
              alt="Profile"
              className="user-dp"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <span 
              className="user-email"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.email}
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {user?.role === "Lawyer" && (
                  <Link to="/attorney-dashboard" className="attorney-dashboard-link">
                    Attorney Dashboard
                  </Link>
                )}
                <Link to="/edit-profile" className="edit-profile-link">
                  Update Profile
                </Link>
                <span className="role">Role: {user?.role || "User"}</span>
                <button className="logout-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/signup"><button className="signup-button">Sign Up</button></Link>
            <Link to="/signin"><button className="login-button">Login</button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
