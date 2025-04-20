import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AttorneyDetail.css';

const AttorneyDetail = () => {
    const { email } = useParams();
    const [attorney, setAttorney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        city: '',
        caseCategory: '',
        shortSummary: '',
        detailSummary: ''
    });

    useEffect(() => {
        if (!email) {
            console.error("Email is undefined in useParams");
            setLoading(false);
            return;
        }

        const decodedEmail = decodeURIComponent(email);
        console.log("Fetching details for email:", decodedEmail);

        axios.get(`http://localhost:5000/attorneys/${decodedEmail}`)
            .then(response => {
                console.log("Attorney data received:", response.data);
                setAttorney(response.data);
            })
            .catch(error => {
                console.error("Error fetching attorney details:", error);
                setAttorney(null);
            })
            .finally(() => setLoading(false));
    }, [email]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/submit-case/${email}`, {
                clientName: formData.fullName,
                caseType: formData.caseCategory,
                description: formData.detailSummary,
                city: formData.city,
                shortSummary: formData.shortSummary
            });

            setSuccessMessage("Case submitted successfully!");  // Set success message
            setFormData({ fullName: '', city: '', caseCategory: '', shortSummary: '', detailSummary: '' });
        } catch (error) {
            console.error("Error submitting case:", error);
            setSuccessMessage("Failed to submit case.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!attorney) return <div className="error">Attorney not found</div>;

    return (
        <div className="attorney-detail">
            <div className="attorney-image">
                <img src={`http://localhost:5000/uploads/${attorney.profile_picture}`} alt={attorney.username} />
            </div>
            <div className="attorney-info">
                <h2>{attorney.username}</h2>
                <p>{attorney.about}</p>
                <p><strong>City:</strong> {attorney.city}</p>
                <p><strong>Experience:</strong> {attorney.experience} years</p>
                <p><strong>Specialization:</strong> {attorney.specialization}</p>

                <button className="hire-button" onClick={() => setShowModal(true)}>Hire Now</button>
            </div>

            {showModal && (
                <div className="modal show">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h3>Hire {attorney.username}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
                            <input type="text" name="city" placeholder="Your City" value={formData.city} onChange={handleInputChange} required />
                            
                            <select name="caseCategory" value={formData.caseCategory} onChange={handleInputChange} required>
                                <option value="">Select Case Category</option>
                                <option value="Criminal Law">Criminal Law</option>
                                <option value="Family Law">Family Law</option>
                                <option value="Business Law">Business Law</option>
                                <option value="Immigration Law">Immigration Law</option>
                            </select>

                            <input 
                                type="text" 
                                name="shortSummary" 
                                placeholder="Short Summary (Max 50 characters)" 
                                maxLength="50" 
                                value={formData.shortSummary}
                                onChange={handleInputChange} 
                                required 
                            />

                            <textarea name="detailSummary" placeholder="Detailed Summary" rows="4" value={formData.detailSummary} onChange={handleInputChange} required></textarea>
                            
                            <button type="submit">Submit</button>
                        </form>

                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    ); 
};

export default AttorneyDetail;
