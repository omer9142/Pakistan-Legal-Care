import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./attorney-page.css";

const AttorneysSection = () => {
    const [attorneys, setAttorneys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState(""); // 🆕
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/attorneys")
            .then(response => setAttorneys(response.data))
            .catch(error => console.error("Error fetching attorneys:", error));
    }, []);

    const filteredAttorneys = attorneys.filter((attorney) => {
        return (
            attorney.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCity === "" || attorney.city === selectedCity) &&
            (selectedSpecialization === "" || attorney.specialization === selectedSpecialization) // 🆕
        );
    });

    const isSingleAttorney = filteredAttorneys.length === 1;

    const handleCardClick = (attorneyEmail) => {
        navigate(`/attorney/${encodeURIComponent(attorneyEmail)}`);
    };

    return (
        <section className="attorneys-section">
            <h2>Our Attorneys</h2>

            <div className="filters-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search Attorneys..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>

                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">All Cities</option>
                    {Array.from(new Set(attorneys.map(a => a.city))).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                {/* 🆕 Specialization Dropdown */}
                <select value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
                    <option value="">All Specializations</option>
                    {Array.from(new Set(attorneys.map(a => a.specialization))).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>

            <div className={`attorneys-container ${isSingleAttorney ? 'single-attorney' : ''}`}>
                {filteredAttorneys.length > 0 ? (
                    filteredAttorneys.map((attorney) => (
                        <div className="attorney-card" key={attorney.email} onClick={() => handleCardClick(attorney.email)}>
                            <img src={`http://localhost:5000/uploads/${attorney.profile_picture}`} alt={attorney.username} />
                            <h3>{attorney.username}</h3>
                            <p>{attorney.about}</p>
                            <p><strong>City:</strong> {attorney.city}</p>
                            <p><strong>Specialization:</strong> {attorney.specialization}</p> {/* 🆕 */}
                        </div>
                    ))
                ) : (
                    <div className="no-attorney-found">No Attorney Found</div>
                )}
            </div>
        </section>
    );
};

export default AttorneysSection;
