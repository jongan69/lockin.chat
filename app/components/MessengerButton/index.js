import React, { useState, useEffect, useRef } from 'react';
import { ForwardToInbox as MessengerIcon } from '@mui/icons-material';
import useSWR from 'swr';
import ReactMarkdown from 'react-markdown';
import './styles.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MessengerButton({ promptData }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: messages, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
  });

  // console.log('Fetched messages:', messages); // Debugging line

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isChatOpen, messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsLoading(true);
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
      setIsLoading(false);
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
            <h4>Lockin with Us</h4>
            <button onClick={() => setIsChatOpen(false)}>Close</button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages?.slice().reverse().map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer">
                        {props.children}
                      </a>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="What the lock?..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <button className="send-button" onClick={handleSendMessage}>Send</button>
            )}
          </div>
        </div>
      )}
    </>
  );
} 