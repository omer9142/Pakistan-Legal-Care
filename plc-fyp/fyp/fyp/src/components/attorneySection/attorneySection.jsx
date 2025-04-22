import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./attorneySection.css";

const AttorneysSection = () => {
    const [attorneys, setAttorneys] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/attorneys")
            .then(response => {
                console.log("Fetched attorneys:", response.data);
                setAttorneys(response.data);
            })
            .catch(error => console.error("Error fetching attorneys:", error));
    }, []);

    const handleCardClick = (attorneyEmail) => {
        console.log("Navigating to attorney details with email:", attorneyEmail);
        navigate(`/attorney/${encodeURIComponent(attorneyEmail)}`);
    };

    return (
        <section className="attorneys-section">
            <h2>Our Attorneys</h2>

            <div className="attorneys-container">
                {attorneys.slice(0, 3).map((attorney) => (
                    <div className="attorney-card" key={attorney.email} onClick={() => handleCardClick(attorney.email)}>
                        <img src={`http://localhost:5000/uploads/${attorney.profile_picture}`} alt={attorney.username} />
                        <h3>{attorney.username}</h3>
                        <p>{attorney.about}</p>
                        <p><strong>City:</strong> {attorney.city}</p>
                    </div>
                ))}

                {attorneys.length === 0 && (
                    <div className="no-attorney-found">No Attorney Found</div>
                )}
            </div>
        </section>
    );
};

export default AttorneysSection;
