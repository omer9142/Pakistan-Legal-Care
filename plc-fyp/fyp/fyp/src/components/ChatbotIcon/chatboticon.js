import React, { useState } from 'react';
import './chatboticon.css';
import Chatbox from './Chatbox.js';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-container">
      <button className="chatbot-btn" onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && <Chatbox />}
    </div>
  );
};

export default ChatbotIcon;
