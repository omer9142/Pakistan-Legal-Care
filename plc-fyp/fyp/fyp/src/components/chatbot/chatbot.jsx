import React, {useState} from 'react';
import './chatbot.css';
import chatbotImage from '../../assets/ThirdImage.jpeg';
import Chatbox from '../ChatbotIcon/Chatbox.js';

const ChatbotSection = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="chatbot-section" style={{ backgroundImage: `url(${chatbotImage})` }}>
            <h2 style={{ color: 'white' }}>Have Legal Questions? Ask Our Chatbot</h2>
            <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>Ask Now</button>
            {isOpen && <Chatbox />}
        </section>
    );
};

export default ChatbotSection;
