import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";

export default function GlobalNotification() {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    let userId = "";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.id;
    } catch (e) {
      return;
    }

    const socket = io("http://localhost:5000");

    socket.emit("join_personal_room", userId);

    socket.on("new_message_notification", (message) => {
      // Ignore if we are currently on the chat page for this exact room
      if (location.pathname === `/chat/${message.orderId}/${message.shopkeeperId}`) {
        return;
      }
      setNotification(message);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    return () => {
      socket.off("new_message_notification");
      socket.disconnect();
    };
  }, [location.pathname]);

  if (!notification) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-white border border-[#411900] shadow-2xl p-4 rounded-xl z-50 cursor-pointer animate-bounce"
      onClick={() => {
        navigate(`/chat/${notification.orderId}/${notification.shopkeeperId}`);
        setNotification(null);
      }}
    >
      <div className="flex gap-3 items-center">
        <div className="bg-[#411900] text-white p-2 rounded-full">
          💬
        </div>
        <div>
          <p className="font-bold text-[#411900]">New Message</p>
          <p className="text-sm text-gray-600 truncate max-w-[200px]">{notification.text}</p>
        </div>
      </div>
    </div>
  );
}
