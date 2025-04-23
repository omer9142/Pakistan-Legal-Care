import React, { useState } from 'react';
import './consultation.css';
import LogoImage from '../../assets/Logo2.png';
import BackgroundImage from '../../assets/Sixth.jpeg';

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    service: '',
    subject: '',
    message: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/request-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          clientName: formData.clientName,
          phone: formData.phone,
          service: formData.service,
          subject: formData.subject,
          description: formData.message,
          message: formData.message
        })
      });

      if (response.ok) {
        setSuccessMessage("Thanks for contacting Pakistan Legal. We will review your request and get back to you.");
        setFormData({
          clientName: '',
          phone: '',
          email: '',
          service: '',
          subject: '',
          message: ''
        });

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert('There was an error submitting your request.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while submitting the consultation.');
    }
  };

  return (
    <section
      className="consultation-section"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="consultation-container">
        <div className="consultation-left">
          <img src={LogoImage} alt="Logo" className="logo-image" />
          <h2 style={{ color: 'white' }}>Request A Free Consultation</h2>
          <p className="mini-text">
            Our team is here to guide you through every step. Fill out the form,
            and we’ll get back to you promptly to address your concerns.
          </p>
        </div>
        <div className="consultation-right">
          <form className="consultation-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="clientName"
              placeholder="Your Name"
              required
              value={formData.clientName}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Select Service</option>
              <option value="civil-law">Civil Law</option>
              <option value="criminal-law">Criminal Law</option>
              <option value="family-law">Family Law</option>
            </select>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <button type="submit">Request Consultation</button>

            <p style={{ color: '#604B33', marginTop: '10px' }}>{successMessage}</p>

          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;
