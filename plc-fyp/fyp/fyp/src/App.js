import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Importing components
import ChatbotIcon from './components/ChatbotIcon/chatboticon.js';
import Navbar from './components/navbar/navbar.jsx';
import HeroSection from './components/hero-section/heroSection.jsx';
import ServicesSection from './components/serviceStation/servicesection.jsx';
import ChatbotSection from './components/chatbot/chatbot.jsx';
import AttorneysSection from './components/attorneySection/attorneySection.jsx';
import TestimonialsSection from './components/testimonials/testimonial.jsx';
import Attorneypage from './components/attorney-page/attorney-page.jsx';
import ConsultationForm from './components/consultation/consultation.jsx';
import Footer from './components/footer/Footer.jsx';
import LaSignupPage from './components/La_signup_page/La_signup_page.jsx';
import CaseSubmit from './components/Case_submit_page/Case_submit.jsx';
import EditProfile from "./components/EditProfile/EditProfile.jsx";
import AttorneyDashboard from './components/AttorneyDashboard/AttorneyDashboard.jsx';
import AttorneyDetail from './components/AttorneyDetail/AttorneyDetail.jsx';
import RequestDetail from './components/RequestDetail/RequestDetail.jsx';

// Pages
import Signin from './components/pages/Signin.js';
import Signup from './components/pages/Signup.js';

// Dummy Data
const attorneys = [
  { name: 'John Doe', type: 'Criminal Lawyer', image: '/images/john.jpg' },
  { name: 'Jane Smith', type: 'Corporate Lawyer', image: '/images/jane.jpg' },
  { name: 'Robert Brown', type: 'Family Lawyer', image: '/images/robert.jpg' },
];

const testimonials = [
  { name: 'Alice Johnson', text: 'Great service and very professional!', rating: 5, image: '/images/alice.jpg' },
  { name: 'Mark Wilson', text: 'They really helped me in my case!', rating: 4, image: '/images/mark.jpg' },
  { name: 'Emily Davis', text: 'Highly recommended for legal advice.', rating: 5, image: '/images/emily.jpg' },
];

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <ChatbotIcon />
      <div className="content">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ServicesSection />
              <ChatbotSection />
              <AttorneysSection attorneys={attorneys} />
              <TestimonialsSection testimonials={testimonials} />
              <ConsultationForm />
            </>
          } />
          <Route path="/attorneys" element={<Attorneypage />} />
          <Route path="/about" element={<h2>About Us</h2>} />
          <Route path="/La_signup_page" element={<LaSignupPage />} />
          <Route path="/contact" element={<h2>Contact Us</h2>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/case-submit" element={<CaseSubmit />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/attorney-dashboard" element={<AttorneyDashboard />} />
          <Route path="/attorney/:email" element={<AttorneyDetail />} />
          <Route path="/request/:id" element={<RequestDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
