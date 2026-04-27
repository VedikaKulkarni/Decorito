import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Start logout process
    sessionStorage.setItem("isLoggedIn", false);

    // Show spinner for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      setMessage("Logout successful! Redirecting to home...");
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#411900] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#411900] font-semibold">Logging out...</p>
        </div>
      ) : (
        <p className="text-green-600 font-semibold text-lg">{message}</p>
      )}
    </div>
  );
}
