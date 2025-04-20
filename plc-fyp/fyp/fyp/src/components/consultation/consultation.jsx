import React from 'react';
import './consultation.css';
import LogoImage from '../../assets/Logo2.png';
import BackgroundImage from '../../assets/Sixth.jpeg';

const ConsultationForm = () => {
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
          <form className="consultation-form">
            <input type="text" placeholder="Your Name" required />
            <input type="tel" placeholder="Your Phone" required />
            <input type="email" placeholder="Your Email" required />
            <select required>
              <option value="">Select Service</option>
              <option value="civil-law">Civil Law</option>
              <option value="criminal-law">Criminal Law</option>
              <option value="family-law">Family Law</option>
            </select>
            <input type="text" placeholder="Subject" required />
            <textarea placeholder="Message" rows="4" required></textarea>
            <button type="submit">Request Consultation</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;
