import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import "./attendeeMessage.css";

export default function Message() {
  const [activeChat, setActiveChat] = useState(0);

  const [messages, setMessages] = useState([
    { from: "them", text: "Welcome to EventSphere 🎉" },
    { from: "me", text: "Thank you! Excited to join." },
  ]);

  const [input, setInput] = useState("");

  // ================= POPUP =================

  const [showPopup, setShowPopup] = useState(false);

  const chats = [
    { name: "Event Support", last: "Need help?" },
    { name: "AI Session Team", last: "See you at 10 AM" },
    { name: "Networking Group", last: "Join meetup" },
  ];

  // ================= SEND MESSAGE =================

 const sendMessage = () => {
  if (!input.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      from: "me",
      text: input,
    },
  ]);

  setInput("");

  // RESET FIRST
  setShowPopup(false);

  // FORCE RE-RENDER
  setTimeout(() => {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);

  }, 100);
};

  return (
    <div className="message-page">

      {/* ================= POPUP ================= */}

    {showPopup ? (
  <div className="message-popup">
    <CheckCircle size={18} />
    <span>Message Sent Successfully</span>
  </div>
) : null}

      {/* ================= LEFT CHAT LIST ================= */}

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

      {/* ================= CHAT BOX ================= */}

      <div className="chat-box">

        {/* HEADER */}

        <div className="chat-header">
          <h3>{chats[activeChat].name}</h3>
        </div>

        {/* MESSAGES */}

        <div className="messages">

          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`bubble ${m.from}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {m.text}
            </motion.div>
          ))}

        </div>

        {/* INPUT */}

        <div className="input-box">

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            <Send size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}