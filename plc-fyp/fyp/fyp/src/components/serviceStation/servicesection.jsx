import React from 'react';
import './servicesection.css';

const ServicesSection = () => {
    const services = [
        { icon: '⚖️', title: 'Chatbot', description: 'Ask legal questions instantly.Get quick responses from our chatbot.Solve basic legal queries without waiting.' },
        { icon: '👪', title: 'Contact Lawyer', description: 'Find and connect with professional lawyers.Browse through our website for expert legal assistance.Get personalized support for your legal needs.' },
        { icon: '📜', title: 'Instant Consultation', description: 'Get immediate legal advice from experts.Our customer support team is available to assist you 24/7.Resolve any legal issue quickly and efficiently on our website.' }, 
      
    ];

    return (
        <section className="services-section">
            <h2>Our Services</h2>
            <div className="services-container">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <div className="service-icon">{service.icon}</div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;