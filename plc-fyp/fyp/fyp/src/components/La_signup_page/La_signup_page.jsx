import { useState, useEffect } from "react";
import axios from "axios";
import "./La_signup_page.css";
import backgroundImage from "./Register.jpg";

export default function LaSignupPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!phone || !city || !experience || !about || !licenseNo || !selectedFile || !profilePicture || !specialization) {
      setMessage("Please fill in all fields and upload your license card, profile picture, and select specialization.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("experience", experience);
    formData.append("about", about);
    formData.append("license_no", licenseNo);
    formData.append("specialization", specialization);
    formData.append("license_card", selectedFile);
    formData.append("profile_picture", profilePicture);

    try {
      await axios.post("http://localhost:5000/register-lawyer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Registration successful!");
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "http://localhost:3000/";
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to submit the form.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="signup-page"
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
      <div className="signup-container" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <div
          className="signup-box"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "10px",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            marginTop: "20px",
          }}
        >
          <h2 className="signup-title" style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
            LAWYER REGISTRATION FORM
          </h2>

          <div className="signup-group">
            <label>Full Name</label>
            <input type="text" className="signup-input" value={username} readOnly />
          </div>

          <div className="signup-group">
            <label>Email</label>
            <input type="email" className="signup-input" value={email} readOnly />
          </div>

          <div className="signup-group">
            <label>Phone Number</label>
            <input type="tel" className="signup-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="signup-group">
            <label>City</label>
            <input type="text" className="signup-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="signup-group">
            <label>Years of Experience</label>
            <input type="number" className="signup-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>

          <div className="signup-group">
            <label>Tell us About Yourself</label>
            <textarea className="signup-textarea" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
          </div>

          <div className="signup-group">
            <label>License Number</label>
            <input type="text" className="signup-input" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} />
          </div>

          <div className="signup-group">
            <label>Specialization</label>
            <select className="signup-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="">Select Specialization</option>
              <option value="Family Law">Family Law</option>
              <option value="Islamic Law">Islamic Law</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Texation Law">Texation Law</option>
              <option value="Traffic Law">Traffic Law</option>
              <option value="Consumer Protection Law">Consumer Protection Law</option>
              <option value="Cyber Law">Cyber Law</option>
              <option value="Environmental Law">Environmental Law</option>
              <option value="Labor Law">Labor Law</option>
              <option value="Constitutional Law">Constitutional Law</option>
            </select>
          </div>

          <div className="signup-group">
            <label>License Card</label>
            <div className="upload-box">
              <input type="file" onChange={handleFileChange} />
              {selectedFile && (
                <div className="file-info">
                  <p>{selectedFile.name}</p>
                  <button onClick={handleRemoveFile} className="remove-button">Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className="signup-group">
            <label>Profile Picture</label>
            <div className="upload-box">
              <input type="file" onChange={handleProfilePictureChange} />
              {profilePicture && (
                <div className="file-info">
                  <p>{profilePicture.name}</p>
                  <button onClick={handleRemoveProfilePicture} className="remove-button">Remove</button>
                </div>
              )}
            </div>
          </div>

          <button
            className="signup-button"
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#8b5e34",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Register
          </button>


          {message && (
            <div className={`message-box ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
