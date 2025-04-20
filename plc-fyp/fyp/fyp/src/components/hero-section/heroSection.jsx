import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './heroSection.css';
import HeroImage from '../../assets/HeroSection.jpg';

const HeroSection = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/user/role', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setUserRole(data.role);
                })
                .catch((err) => console.error('Error fetching role:', err));
        }
    }, []);

    const handleJoinAsLawyer = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/La_signup_page');
        } else {
            navigate('/signin');
        }
    };

    const handleFindLawyer = () => {
        navigate('/attorneys');
    };

    return (
        <section className="hero-section" style={{ backgroundImage: `url(${HeroImage})` }}>
            <div className="hero-content">
                <h1>
                    WE PROVIDE THE BEST<br />
                    POSSIBLE <span className="highlight">LEGAL SOLUTIONS</span>
                </h1>
                <br />
                <p>
                    Access our AI chatbot for instant guidance anytime, and connect with verified,
                    skilled lawyers for comprehensive legal support.
                </p>
                <br />
                {userRole !== 'Lawyer' ? (
                    <>
                        <button className="button-primary" onClick={handleFindLawyer}>Find a Lawyer</button>
                        <button className="button-primary" onClick={handleJoinAsLawyer}>Join as a Lawyer</button>
                    </>
                ) : (
                    <button className="button-primary single-button" onClick={handleFindLawyer}>Find a Lawyer</button>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
