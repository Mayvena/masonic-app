// client/src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const [room] = useState('global');
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // join the chat room when component mounts
    socket.emit('join', { room });

    socket.on('chatMessage', (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    // clean-up function on unmount
    return () => {
      socket.off('chatMessage');
    };
  }, [room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const data = { room, message, sender: 'You' };
    socket.emit('chatMessage', data);
    setChatLog((prev) => [...prev, data]);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ border: '1px solid #ccc', height: '200px', overflowY: 'scroll' }}>
        {chatLog.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
      </div>
      <input type="text" placeholder="Type your message"
             value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;