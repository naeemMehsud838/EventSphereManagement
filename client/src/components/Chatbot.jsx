// src/components/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// const API_KEY = "AIzaSyCSKoZ92zH5SqCohx68BKX-_dnGuZU0qzM";
const API_KEY = "AIzaSyCvnUnmsdCwf-W7jrUpVCklG5fXuhEhnXE";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const SYSTEM_PROMPT = `You are EventSphere Assistant, a helpful AI chatbot for the EventSphere Event Management Platform.

About EventSphere:
- EventSphere is a full-stack MERN event management platform
- It has three roles: Admin, Exhibitor, and Attendee
- Admins can create/manage events, approve attendees, manage booths, view tickets and schedules
- Exhibitors can create booths (pending admin approval), view events, send messages to admin
- Attendees register (pending admin approval), book events, manage their schedule and sessions

You can help users with:
- How to register and get approved
- How to book events and manage bookings
- How to create and manage booths
- How to navigate the platform
- General questions about events
- Any other EventSphere related questions

Keep responses concise, friendly and helpful. Use emojis occasionally to be friendly.
If asked something unrelated to EventSphere, politely redirect to EventSphere topics.`;

export default function Chatbot() {
  const { user } = useAuth();
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `👋 Hi${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! I'm the **EventSphere Assistant**.\n\nHow can I help you today?`,
    },
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.role !== "bot" || messages.indexOf(m) > 0)
        .map((m) => ({
          role:  m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      // Build contents with system prompt injected as first user/model exchange
      const contents = [
        { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood! I am the EventSphere Assistant. How can I help you?" }] },
        ...history,
        { role: "user",  parts: [{ text: userText }] },
      ];

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });

      const data = await response.json();

      // Log error details if any
      if (data.error) {
        console.error("Gemini error:", data.error);
        throw new Error(data.error.message);
      }

      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "Sorry, I couldn\'t process that. Please try again.";

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (err) {
      console.error("Chatbot full error:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Connection error. Please check console for details." }]);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown-like formatting
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g,     "<em>$1</em>")
      .replace(/\n/g,            "<br/>");
  };

  return (
    <>
      <style>{`
        .cb-bubble {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(124,58,237,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
          font-size: 24px;
        }
        .cb-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(124,58,237,0.7);
        }
        .cb-window {
          position: fixed;
          bottom: 96px;
          right: 28px;
          z-index: 9999;
          width: 360px;
          height: 520px;
          border-radius: 20px;
          background: #13131f;
          border: 1px solid rgba(124,58,237,0.3);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: cb-slide-in 0.25s ease;
        }
        @keyframes cb-slide-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .cb-header {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .cb-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cb-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .cb-header-info h4 {
          margin: 0;
          color: white;
          font-size: 14px;
          font-weight: 700;
        }
        .cb-header-info p {
          margin: 0;
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cb-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
        }
        .cb-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cb-messages::-webkit-scrollbar { width: 4px; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }
        .cb-msg {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .cb-msg.user { flex-direction: row-reverse; }
        .cb-msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }
        .cb-msg.user .cb-msg-avatar {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
        }
        .cb-msg-bubble {
          max-width: 80%;
          padding: 9px 13px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.5;
          color: white;
        }
        .cb-msg.bot  .cb-msg-bubble { background: rgba(255,255,255,0.08); border-radius: 16px 16px 16px 4px; }
        .cb-msg.user .cb-msg-bubble { background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 16px 16px 4px 16px; }
        .cb-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 9px 13px;
        }
        .cb-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          animation: cb-bounce 1.2s infinite;
        }
        .cb-dot:nth-child(2) { animation-delay: 0.2s; }
        .cb-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cb-bounce {
          0%, 60%, 100% { transform: translateY(0);    }
          30%           { transform: translateY(-6px); }
        }
        .cb-input-area {
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .cb-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .cb-input:focus { border-color: rgba(124,58,237,0.6); }
        .cb-input::placeholder { color: rgba(255,255,255,0.3); }
        .cb-send {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .cb-send:hover:not(:disabled) { opacity: 0.9; transform: scale(1.05); }
        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .cb-quick-btns {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          padding: 0 12px 10px;
        }
        .cb-quick-btn {
          padding: 5px 10px;
          border-radius: 20px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cb-quick-btn:hover { background: rgba(124,58,237,0.3); color: white; }
        @media (max-width: 420px) {
          .cb-window { width: calc(100vw - 32px); right: 16px; bottom: 80px; }
          .cb-bubble { right: 16px; bottom: 16px; }
        }
      `}</style>

      {/* FLOATING BUBBLE */}
      <button className="cb-bubble" onClick={() => setOpen((o) => !o)} title="EventSphere Assistant">
        {open ? "✕" : "🤖"}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="cb-window">

          {/* HEADER */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">🤖</div>
              <div className="cb-header-info">
                <h4>EventSphere Assistant</h4>
                <p><span className="cb-online-dot" /> Online — Powered by Gemini</p>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg ${msg.role}`}>
                <div className="cb-msg-avatar">
                  {msg.role === "bot" ? "🤖" : (user?.name?.charAt(0).toUpperCase() || "👤")}
                </div>
                <div
                  className="cb-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
              </div>
            ))}

            {loading && (
              <div className="cb-msg bot">
                <div className="cb-msg-avatar">🤖</div>
                <div className="cb-msg-bubble cb-typing">
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                  <div className="cb-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK QUESTIONS — shown only if conversation is just the welcome message */}
          {messages.length === 1 && (
            <div className="cb-quick-btns">
              {[
                "How do I book an event?",
                "How do booths work?",
                "How to get approved?",
                "What is EventSphere?",
              ].map((q) => (
                <button key={q} className="cb-quick-btn" onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="cb-input-area">
            <input
              ref={inputRef}
              className="cb-input"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button className="cb-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

        </div>
      )}
    </>
  );
}