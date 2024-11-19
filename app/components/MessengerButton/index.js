import React, { useState, useEffect, useRef } from 'react';
import { ForwardToInbox as MessengerIcon } from '@mui/icons-material';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import useSWR from 'swr';
import './styles.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MessengerButton({ promptData }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, input, setInput, append } = useChat();
  const chatBodyRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const { data: serverMessages, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
  });

  useEffect(() => {
    if (isChatOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isChatOpen, messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setIsSending(true);
      setInput('');

      // Post the message to the server
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, role: 'user' }),
      });

      // Append the message locally
      append({ content: input, role: 'user' });

      // Send the message to the AI endpoint
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ content: input, role: 'user' }],
          promptData: promptData,
        }),
      });

      const aiData = await aiResponse.json();

      // Append the AI's response
      append({ content: aiData.content, role: 'assistant' });

      // Revalidate the SWR cache to fetch new messages
      mutate();

      setIsSending(false);
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
            {(serverMessages || []).map((msg, index) => (
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
              placeholder="Need help locking in?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button className="send-button" onClick={handleSendMessage} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
} 