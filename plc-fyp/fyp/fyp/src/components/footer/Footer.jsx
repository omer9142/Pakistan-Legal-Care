import React from 'react';
import './Footer.css';
import footerImage from '../../assets/Logo.png';

const Footer= ()=> {
  return (
    <footer className="footer">
      <div className="footer-container">
      <div className="footer-logo" style={{ backgroundImage: `url(${footerImage})` }}></div>
    
        <div className="footer-column">
             <h4>Links</h4>
          <ul>
            <li>Home</li>
            <li>Attorney</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Find Us</h4>
          <p>42-K, Islamabad Road, Faisalabad</p>
          <p>+92 315 094 300</p>
          <p>service@pakistanlegalcare.com</p>
        </div>
        <div className="footer-column">
          <h4>Practice Areas</h4>
          <ul>
            <li>Civil Law</li>
            <li>Family Law</li>
            <li>Corporate Law</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
