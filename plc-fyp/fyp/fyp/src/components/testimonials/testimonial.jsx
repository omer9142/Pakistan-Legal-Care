import React from 'react';
import './testimonial.css';
import user1 from '../../assets/attorney1.jpg';  // Adjust the path as needed
import user2 from '../../assets/attorney2.jpg'; 
import user3 from '../../assets/attorney3.jpg'; 

const testimonialsData = [
  {
    text: "This service is amazing!",
    name: "John Doe",
    image: user1
  },
  {
    text: "Highly recommended!",
    name: "Jane Smith",
    image: user2
  },
  {
    text: "Highly recommended!",
    name: "Yousuf Tahir",
    image: user3
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2>What Our Client Says</h2>
      <h3 className="mini-heading">Our Testimonials</h3>
      <div className="carousel-container">
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-info">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
              <h4 className="testimonial-name">{testimonial.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
