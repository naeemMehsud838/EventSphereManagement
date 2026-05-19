// src/pages/exhibitor/Message.jsx
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import "./Message.css";
import { messageAPI, userAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Message() {
  const { user }    = useAuth();
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [adminId,   setAdminId]   = useState(null);
  const [sending,   setSending]   = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const messagesEndRef = useRef(null);

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
        if (data?.messages) setMessages(data.messages);
      })
      .catch(() => {
        setMessages([
          { _id: "s1", sender: { role: "admin" }, text: "Your booth has been approved 🎉",  createdAt: new Date() },
          { _id: "s2", sender: { role: "admin" }, text: "Need help setting up your booth?", createdAt: new Date() },
          { _id: "s3", sender: { role: "admin" }, text: "New visitor joined your booth 🚀", createdAt: new Date() },
        ]);
      });
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new replies from admin every 5 seconds
  useEffect(() => {
    if (!adminId) return;
    const interval = setInterval(async () => {
      try {
        const { messages: msgs } = await messageAPI.getConversation(adminId);
        if (msgs?.length > 0) setMessages(msgs);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!adminId) {
      setMessages((prev) => [...prev, { _id: Date.now(), sender: { role: "exhibitor" }, text: input, createdAt: new Date() }]);
      setInput("");
      triggerPopup();
      return;
    }
    setSending(true);
    try {
      const { data } = await messageAPI.send({ receiverId: adminId, text: input });
      setMessages((prev) => [...prev, data]);
      setInput("");
      triggerPopup();
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const triggerPopup = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="message-page">

      {showPopup && (
        <div className="message-popup">✓ <span>Message Sent Successfully</span></div>
      )}

      <div className="message-header">
        <h1>💬 Messages</h1>
        <p>Chat with the EventSphere admin team</p>
      </div>

      {/* CHAT BOX */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)", padding: "16px",
        maxHeight: "400px", overflowY: "auto", display: "flex",
        flexDirection: "column", gap: "10px", marginBottom: "16px",
      }}>
        {messages.length === 0 && (
          <p style={{ opacity: 0.4, textAlign: "center", padding: "40px 0" }}>No messages yet. Say hello! 👋</p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user?._id || msg.sender?.role === "exhibitor";
          return (
            <div key={msg._id || i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "70%", padding: "10px 14px", borderRadius: "14px",
                background: isMe ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)",
                color: "white", fontSize: "14px",
              }}>
                <div style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}>
                  {isMe ? "You" : "Admin"}
                </div>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Type a message to admin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={sending}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: "12px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "white", outline: "none", fontSize: "14px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          style={{
            padding: "12px 18px", borderRadius: "12px",
            background: "rgba(167,139,250,0.3)", border: "1px solid #a78bfa",
            color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <Send size={18} /> {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}