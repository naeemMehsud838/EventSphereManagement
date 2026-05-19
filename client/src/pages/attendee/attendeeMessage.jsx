// src/pages/attendee/attendeeMessage.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import "./attendeeMessage.css";
import { messageAPI, userAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Message() {
  const { user }     = useAuth();
  const [activeChat, setActiveChat] = useState(0);
  const [messages,   setMessages]   = useState([
    { from: "them", text: "Welcome to EventSphere 🎉" },
    { from: "me",   text: "Thank you! Excited to join." },
  ]);
  const [input,     setInput]     = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [adminId,   setAdminId]   = useState(null);
  const [sending,   setSending]   = useState(false);
  const messagesEndRef = useRef(null);

  const chats = [
    { name: "Event Support",    last: "Need help?" },
    { name: "AI Session Team",  last: "See you at 10 AM" },
    { name: "Networking Group", last: "Join meetup" },
  ];

  // Load admin ID + conversation on mount
  useEffect(() => {
    userAPI.getAdminContact()
      .then(({ admin }) => {
        if (admin) {
          setAdminId(admin._id);
          return messageAPI.getConversation(admin._id);
        }
      })
      .then((data) => {
        if (data?.messages?.length > 0) {
          setMessages(data.messages.map((msg) => ({
            from: msg.sender?._id === user?._id || msg.sender?.role === "attendee" ? "me" : "them",
            text: msg.text,
            _id:  msg._id,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new replies from admin every 5 seconds
  useEffect(() => {
    if (!adminId) return;
    const interval = setInterval(async () => {
      try {
        const { messages: msgs } = await messageAPI.getConversation(adminId);
        if (msgs?.length > 0) {
          setMessages(msgs.map((msg) => ({
            from: msg.sender?._id === user?._id || msg.sender?.role === "attendee" ? "me" : "them",
            text: msg.text,
            _id:  msg._id,
          })));
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [adminId, user]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");

    // Optimistically show in UI
    setMessages((prev) => [...prev, { from: "me", text }]);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);

    if (!adminId) return;
    setSending(true);
    try {
      await messageAPI.send({ receiverId: adminId, text });
    } catch {}
    finally { setSending(false); }
  };

  return (
    <div className="message-page">

      {showPopup && (
        <div className="message-popup">
          <CheckCircle size={18} />
          <span>Message Sent Successfully</span>
        </div>
      )}

      {/* LEFT CHAT LIST */}
      <div className="chat-list">
        <h2>Messages 💬</h2>
        {chats.map((c, i) => (
          <div
            key={i}
            className={`chat-item ${activeChat === i ? "active" : ""}`}
            onClick={() => setActiveChat(i)}
          >
            <h4>{c.name}</h4>
            <p>{c.last}</p>
          </div>
        ))}
      </div>

      {/* CHAT BOX */}
      <div className="chat-box">
        <div className="chat-header">
          <h3>{activeChat === 0 ? "Admin Support" : chats[activeChat].name}</h3>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <motion.div
              key={m._id || i}
              className={`bubble ${m.from}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {m.text}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={sending}
          />
          <button onClick={sendMessage} disabled={sending}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}