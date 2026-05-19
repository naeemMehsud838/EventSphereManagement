// src/pages/admin/AdminMessages.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { FaTools, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaShieldAlt, FaTrash } from "react-icons/fa";
import "./AdminMessages.css";
import { messageAPI } from "../../api";

// ── Static system notifications (kept as-is, original UI) ──
const STATIC_MESSAGES = {
  system: [
    { type: "Maintenance", text: "Site will be down for 2 hours on May 15 (2AM - 4AM PST)", meta: "EventSphere System" },
    { type: "Feature",     text: "Ticket scanning feature has been added successfully",      meta: "EventSphere Update" },
  ],
  events: [
    { type: "Approved",  text: "Your event 'Tech Meetup 2026' is now live",           meta: "Event ID: 2045" },
    { type: "Cancelled", text: "'Startup Expo 2026' has been cancelled by organizer", meta: "Event ID: 1982" },
  ],
  users: [
    { type: "Report",    text: "User Ali Khan reported a payment issue",   meta: "Event ID: 2041" },
    { type: "New Event", text: "A new event 'AI Summit' was created",      meta: "User: Admin Panel" },
  ],
  payments: [
    { type: "Refund",  text: "Refund of $25 processed successfully",          meta: "Order #8891" },
    { type: "Payment", text: "Payment failed for Event Ticket purchase",       meta: "Order #7720" },
  ],
  security: [
    { type: "Warning", text: "15 failed login attempts detected",              meta: "IP: 103.45.xxx.xxx" },
    { type: "System",  text: "API response delay detected in server cluster",  meta: "Monitoring System" },
  ],
};

const Section = ({ title, icon, data, onDelete }) => (
  <>
    <div className="section-title">{icon} {title}</div>
    {data.map((msg, i) => (
      <div className="card" key={i}>
        <div className="card-header"><span className="badge">{msg.type}</span></div>
        <div className="card-content">{msg.text}</div>
        <div className="card-footer">
          <small>{msg.meta}</small>
          <button className="remove-btn" onClick={() => onDelete(i)}><FaTrash /></button>
        </div>
      </div>
    ))}
  </>
);

const AdminMessages = () => {
  const [staticMsgs,   setStaticMsgs]   = useState(STATIC_MESSAGES);
  const [userChats,    setUserChats]     = useState([]);  // real user conversations
  const [activeChat,   setActiveChat]    = useState(null);
  const [conversation, setConversation]  = useState([]);
  const [replyText,    setReplyText]     = useState("");
  const [sending,      setSending]       = useState(false);
  const messagesEndRef = useRef(null);

  const loadChats = useCallback(() => {
    messageAPI.getAll()
      .then(({ messages }) => {
        if (!messages?.length) return;
        const chatMap = new Map();
        for (const msg of messages) {
          const other = msg.sender?.role !== "admin" ? msg.sender : msg.receiver;
          if (other && other.role !== "admin" && !chatMap.has(other._id)) {
            chatMap.set(other._id, {
              _id:     other._id,
              name:    other.name,
              role:    other.role,
              lastMsg: msg.text,
            });
          }
        }
        setUserChats(Array.from(chatMap.values()));
      })
      .catch(() => {});
  }, []);

  // Load on mount + poll every 5 seconds for new messages
  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, [loadChats]);

  const openChat = async (chatUser) => {
    setActiveChat(chatUser);
    try {
      const { messages } = await messageAPI.getConversation(chatUser._id);
      setConversation(messages || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setConversation([]);
    }
  };

  // Poll active conversation every 4 seconds for new replies
  useEffect(() => {
    if (!activeChat) return;
    const interval = setInterval(async () => {
      try {
        const { messages } = await messageAPI.getConversation(activeChat._id);
        setConversation(messages || []);
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [activeChat]);

  const handleReply = async () => {
    if (!replyText.trim() || !activeChat) return;
    setSending(true);
    try {
      const { data } = await messageAPI.send({ receiverId: activeChat._id, text: replyText });
      setConversation((prev) => [...prev, data]);
      setReplyText("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      alert("Send failed: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleStaticDelete = (section, index) => {
    setStaticMsgs((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container">
      <div className="header">📩 EventSphere Admin Messages</div>

      {/* ── USER CONVERSATIONS (real DB messages) ── */}
      {userChats.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div className="section-title">💬 User Conversations</div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
            {userChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => openChat(chat)}
                style={{
                  padding: "12px 18px", borderRadius: "12px", cursor: "pointer",
                  background: activeChat?._id === chat._id ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${activeChat?._id === chat._id ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
                  color: "white", fontSize: "14px", fontWeight: 600,
                }}
              >
                {chat.name} <span style={{ opacity: 0.5, fontSize: "11px", textTransform: "capitalize" }}>({chat.role})</span>
              </div>
            ))}
          </div>

          {/* Conversation view */}
          {activeChat && (
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "16px" }}>
              <h4 style={{ color: "white", marginBottom: "12px" }}>Chat with {activeChat.name}</h4>

              <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {conversation.map((msg, i) => {
                  const isAdmin = msg.sender?.role === "admin";
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "70%", padding: "10px 14px", borderRadius: "14px",
                        background: isAdmin ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)",
                        color: "white", fontSize: "14px",
                      }}>
                        <div style={{ fontSize: "11px", opacity: 0.5, marginBottom: "4px" }}>
                          {isAdmin ? "You (Admin)" : msg.sender?.name}
                        </div>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder={`Reply to ${activeChat.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  disabled={sending}
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "white", outline: "none", fontSize: "14px",
                  }}
                />
                <button
                  onClick={handleReply}
                  disabled={sending}
                  style={{
                    padding: "10px 16px", borderRadius: "10px",
                    background: "rgba(167,139,250,0.3)", border: "1px solid #a78bfa",
                    color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  <Send size={16} /> {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STATIC SYSTEM NOTIFICATIONS (original UI) ── */}
      <Section title="System Announcements"       icon={<FaTools />}         data={staticMsgs.system}   onDelete={(i) => handleStaticDelete("system",   i)} />
      <Section title="Event Alerts"               icon={<FaCalendarAlt />}   data={staticMsgs.events}   onDelete={(i) => handleStaticDelete("events",   i)} />
      <Section title="User Activity Notifications"icon={<FaUsers />}         data={staticMsgs.users}    onDelete={(i) => handleStaticDelete("users",    i)} />
      <Section title="Payments & Transactions"    icon={<FaMoneyBillWave />} data={staticMsgs.payments} onDelete={(i) => handleStaticDelete("payments", i)} />
      <Section title="Security & System Warnings" icon={<FaShieldAlt />}     data={staticMsgs.security} onDelete={(i) => handleStaticDelete("security", i)} />
    </div>
  );
};

export default AdminMessages;