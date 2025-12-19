
import React, { useState, useEffect, useRef } from 'react';
import Root from '@theme-original/Root';
import axios from 'axios';
import './chatbot.css';

export default function RootWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      try {
        const response = await axios.post('http://localhost:8000/chat/', {
          message: input,
        });
        const botMessage = response.data.response;
        setMessages([...newMessages, { text: botMessage, sender: 'bot' }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages([...newMessages, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
      }
    }
  };

  return (
    <>
      <Root>{children}</Root>
      <div className="chatbot-container">
        <button className="chatbot-toggle" onClick={toggleChat}>
          {isOpen ? 'X' : 'Chat'}
        </button>
        {isOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h2>Project Assistant</h2>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
