import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";
import registerBg from "./Register.jpg";

const EditProfile = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.email);
      checkIfLawyer(storedUser.email);
    }
  }, []);

  const checkIfLawyer = (email) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/user/role", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.role === "Lawyer") {
          setIsLawyer(true);
          fetchUserProfile();
        } else {
          setIsLawyer(false);
          fetchUserProfile();
        }
      })
      .catch((err) => console.error("Error checking role:", err));
  };

  const handleVerifyPassword = () => {
    axios
      .post("http://localhost:5000/verify-password", { email, password })
      .then(() => {
        setStep(2);
        fetchUserProfile();
      })
      .catch(() => setError("Invalid password"));
  };

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data || {}))
      .catch((err) => console.error("Error fetching profile:", err));
  };

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    // Validation
    if (!user.username || !user.email) {
      alert("Username is required.");
      return;
    }
  
    if (isLawyer) {
      if (
        !user.experience ||
        !user.license_no ||
        !user.about ||
        !user.phone ||
        !user.city
      ) {
        alert("All fields are required");
        return;
      }
    }
  
    axios
      .put("http://localhost:5000/update-profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.setItem("user", JSON.stringify(user));
        alert("Profile updated successfully!");
        fetchUserProfile();
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      });
  };
  

  return (
    <div
      className="edit-profile-container"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "100px 0",
      }}
    >
      <div className="profile-box">
        {step === 1 ? (
          <>
            <h2>Verify Password</h2>
            <label>Email:</label>
            <input type="email" value={email} disabled />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="verify-password-input"
            />

            {error && <p className="error-message">{error}</p>}
            <button onClick={handleVerifyPassword}>Next</button>
          </>
        ) : (
          <div className="profile-edit-form">
            <h2>Update Profile</h2>

            {isLawyer ? (
              <>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={user.username || ""}
                  onChange={handleChange}
                />

                <label>Email:</label>
                <input type="email" value={user.email || ""} disabled />

                <label>Experience:</label>
                <input
                  type="text"
                  name="experience"
                  value={user.experience || ""}
                  onChange={handleChange}
                />

                <label>License No:</label>
                <input type="text" value={user.license_no || ""} disabled />

                <label>About:</label>
                <textarea
                  name="about"
                  value={user.about || ""}
                  onChange={handleChange}
                ></textarea>

                <label>License Card:</label>
                {user.license_card && (
                  <img
                    src={`http://localhost:5000/uploads/${user.license_card}`}
                    alt="License Card"
                    className="license-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-license.png";
                    }}
                  />
                )}

                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                />

                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={user.city || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={user.username || ""}
                  onChange={handleChange}
                />

                <label>Email:</label>
                <input type="email" value={user.email || ""} disabled />
              </>
            )}

            <button onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
