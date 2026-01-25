import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";



const SocketChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const url = "http://localhost:5000"; // Connect to Flask server
  let socket;
  useEffect(() => {
    if (!socket) {
    //   socket = io(url, {
    //     transports: ["websocket"], // You can change this if needed.
    //   });
      socket = io(url);
    }

    socket.on("message", (data) => {
      console.log("Polling data:", data);
      setMessages((prevMessages) => [...prevMessages, data.msg]);
    });

    return () => {
      socket.off("message");
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket?.emit("message", message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div>
      <h2>React & Flask Socket.IO Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SocketChat;
