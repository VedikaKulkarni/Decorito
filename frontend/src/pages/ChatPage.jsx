import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeft, Send } from "lucide-react";

// Use a singleton pattern or initialize outside if outside of React lifecycle. 
// Standard practice is declaring inside useEffect or use state if relying on dynamic vars.
let socket;

export default function ChatPage() {
  const { orderId, shopkeeperId } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("userRole");

  // Decode user ID from token
  let userId = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.id;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const roomId = `${orderId}_${shopkeeperId}`;
  
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    // Connect to socket
    socket = io("http://localhost:5000");

    // Join room
    socket.emit("join_room", roomId);

    // Fetch previous chats
    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();

    // Listen for new messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [roomId, token, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      orderId,
      shopkeeperId,
      senderId: userId,
      senderRole: userRole, // "user" or "shopkeeper"
      text: newMessage,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#411900] shadow-md p-4 flex items-center sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="mr-4 text-white hover:text-gray-300 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Order Chat</h1>
          <p className="text-sm text-gray-200">Order ID: #{orderId.slice(-6)}</p>
        </div>
      </header>

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userId;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isMe 
                    ? "bg-[#411900] text-white rounded-br-none" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[10px] ${isMe ? "text-gray-300" : "text-gray-400"} block mt-1 text-right`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="bg-[#411900] p-4 flex items-center gap-3 shadow-inner">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-white text-gray-900 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#f0e6df]"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-white text-[#411900] hover:bg-gray-100 p-3 rounded-full transition disabled:opacity-50 shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
