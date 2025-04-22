import React, { useEffect, useState, useRef } from 'react';
import './chatboticon.css';
import { useNavigate } from "react-router-dom";

const staticResponses = {
  "Is court marriage legal in Pakistan?": {
    answer: "Yes, court marriage is legal in Pakistan. Both parties must be adults (18+), and it is registered under the Muslim Family Laws Ordinance.",
    context: "In Pakistan, court marriage is legal under the Muslim Family Laws Ordinance. Both parties must be adults (18+) to marry legally.",
    tag: "Family Law",
  },
  "What are the legal rights of daughters in property after father's death?": {
    answer: "Under Islamic inheritance law in Pakistan, daughters are entitled to inherit property from their father's estate. They receive half the share of a son.",
    context: "Under Islamic inheritance law, daughters in Pakistan are entitled to inherit from their father's estate, receiving half the share of a son.",
    tag: "Inheritance Law",
  },
};

const Chatbox = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "I’m from Pakistan Legal Care.\nI’m here to Help you."
    }
  ]);

  const [input, setInput] = useState('');
  const [showLawyerPopup, setShowLawyerPopup] = useState(false);
  const [matchedLawyers, setMatchedLawyers] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const searchLawyersBySpecialization = async (area) => {
    try {
      const response = await fetch(`http://localhost:5000/search-lawyers?area=${encodeURIComponent(area)}`);
      const data = await response.json();
      setMatchedLawyers(data);
      setSelectedArea(area);
      setShowLawyerPopup(true);
    } catch (error) {
      console.error('Error searching lawyers:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Sorry, I couldn't find any lawyers for this area."
      }]);
    }
  };

  const handleSend = () => {
    const question = input.trim();
    if (!question) return;

    const userMsg = { sender: 'user', text: question };
    const botData = staticResponses[question];

    let newMessages = [userMsg];

    if (botData) {
      newMessages.push({
        sender: 'bot',
        text: `${botData.answer} \n\n📚 Context: ${botData.context} \n🏷️ Area: ${botData.tag}`,
        tag: botData.tag
      });
    } else {
      newMessages.push({
        sender: 'bot',
        text: "Sorry, I don't have an answer for that yet."
      });
    }

    setMessages(prev => [...prev, ...newMessages]);
    setInput('');
  };

  const closePopup = () => {
    setShowLawyerPopup(false);
    setMatchedLawyers([]);
  };

  const handleSuggestLawyer = (tag) => {
    if (tag) {
      searchLawyersBySpecialization(tag);
    }
  };

  const handleCardClick = (attorneyEmail) => {
    navigate(`/attorney/${encodeURIComponent(attorneyEmail)}`);
    closePopup();
  };

  return (
    <>
      {isChatVisible && (
        <div className="chatbox">
          <div className="chatbox-header">
            Legal Assistant
            <button className="chatbox-close-btn" onClick={() => setIsChatVisible(false)}>×</button>
          </div>

          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                <div>{msg.text}</div>
                {msg.sender === 'bot' && msg.tag && (
                  <>
                    <p>The lawyers that can help you in this case are available below:</p>
                    <button
                      className="suggest-lawyer-btn"
                      onClick={() => handleSuggestLawyer(msg.tag)}
                    >
                      Suggested Lawyer (Click to view list)
                    </button>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>


          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Ask your legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>

          {/* Lawyer Popup */}
          {showLawyerPopup && (
            <div className="lawyer-popup-overlay">
              <div className="lawyer-popup">
                <div className="popup-header">
                  <h3>Recommended {matchedLawyers.length > 1 ? 'Lawyers' : 'Lawyer'} for {selectedArea}</h3>
                  <button className="close-btn" onClick={closePopup}>×</button>
                </div>
                {matchedLawyers.length > 0 ? (
                  <div className="lawyer-list">
                    {matchedLawyers.map(lawyer => (
                      <div key={lawyer.id} className="lawyer-card">
                        <div className="lawyer-image">
                          {lawyer.profile_picture ? (
                            <img src={`http://localhost:5000/uploads/${lawyer.profile_picture}`} alt={lawyer.username} />
                          ) : (
                            <div className="avatar-placeholder">{lawyer.username.charAt(0)}</div>
                          )}
                        </div>
                        <div className="lawyer-info">
                          <h4>{lawyer.username}</h4>
                          <p><strong>Specialization:</strong> {lawyer.specialization}</p>
                          <p><strong>Experience:</strong> {lawyer.experience} years</p>
                          <p><strong>Location:</strong> {lawyer.city}</p>
                          <button
                            className="view-profile-btn"
                            onClick={() => handleCardClick(lawyer.email)}
                          >
                            View Full Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-lawyers">No lawyers found specializing in this area.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )
      }
    </>
  );

};

export default Chatbox;
