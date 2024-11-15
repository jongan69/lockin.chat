import React, { useState } from 'react';
import { ForwardToInbox as MessengerIcon } from '@mui/icons-material';
import useSWR from 'swr';
import './styles.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MessengerButton({ promptData }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const { data: messages, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
  });

  console.log('Fetched messages:', messages); // Debugging line

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage, role: "user" }),
      });
      await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage, role: "user", promptData: promptData }),
      });
      setNewMessage('');
      mutate(); // Revalidate the SWR cache to fetch new messages
    }
  };

  return (
    <>
      <div className="messenger-button" onClick={() => setIsChatOpen(!isChatOpen)}>
        <MessengerIcon />
      </div>
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>Chat with Us</h4>
            <button onClick={() => setIsChatOpen(false)}>Close</button>
          </div>
          <div className="chat-body">
            {messages?.map((msg, index) => (
              <div key={index} className="message-bubble">
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
} 