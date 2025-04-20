import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import backgroundImage from "./Register.jpg";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/signin", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/"); // Redirect after login
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div
      className="signin-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="signin-form-container">
        <h2 className="signin-heading">Login</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="signin-input-group">
            <label className="signin-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="signin-input"
              required
            />
          </div>
          <div className="signin-input-group password-group">
            <label className="signin-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="signin-input"
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing in..." : "Signin"}
          </button>
          {error && <p className="signin-error">{error}</p>}
        </form>
        <p className="register-message">
          Not a user?{" "}
          <Link to="/signup" className="register-link">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;