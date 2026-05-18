import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Users, Plus, Search, Filter, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import "./Session.css";
import { scheduleAPI } from "../../api";

const ALL_SESSIONS = [
  { title: "AI & Future Tech",    time: "10:00 AM - 11:30 AM", location: "Hall A", speaker: "Dr. Ahmed Khan", attendees: 120, category: "Technology", status: "Live"     },
  { title: "Startup Growth Hacks",time: "12:00 PM - 1:00 PM",  location: "Hall B", speaker: "Sara Ali",       attendees: 85,  category: "Business",   status: "Upcoming" },
  { title: "Web3 & Blockchain",   time: "2:00 PM - 3:30 PM",   location: "Hall C", speaker: "John Smith",     attendees: 150, category: "Innovation", status: "Popular"  },
];

export default function Session() {
  const [openModal,  setOpenModal]  = useState(false);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const [loading,    setLoading]    = useState(false);
  const [form, setForm] = useState({ title: "", speaker: "", time: "", location: "", category: "Technology", description: "" });

  const categories = ["All", "Technology", "Business", "Innovation", "Marketing", "Startup"];

  const filtered = ALL_SESSIONS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                        s.speaker.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.category === filter;
    return matchSearch && matchFilter;
  });

  const handleJoin = (title) => {
    Swal.fire({
      title: "🎉 Joined!",
      text: `You successfully joined "${title}" session!`,
      icon: "success",
      confirmButtonColor: "#7c3aed",
      background: "#1e1e2e",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleSave = (title) => {
    Swal.fire({
      title: "💾 Saved!",
      text: `"${title}" session saved to your schedule!`,
      icon: "success",
      confirmButtonColor: "#7c3aed",
      background: "#1e1e2e",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scheduleAPI.create({
        event: form.title,
        time:  form.time,
        emoji: "🎤",
        date:  new Date().toISOString().split("T")[0],
      });
      setOpenModal(false);
      setForm({ title: "", speaker: "", time: "", location: "", category: "Technology", description: "" });
      Swal.fire({ title: "Session Created!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e1e2e", color: "#fff" });
    } catch (err) {
      Swal.fire({ title: "Failed", text: err.message, icon: "error", background: "#1e1e2e", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="session-page">

      <motion.div className="session-topbar" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>Explore Sessions 🎤</h1>
          <p>Discover live talks, workshops, and networking sessions</p>
        </div>
        <button className="create-btn" onClick={() => setOpenModal(true)}>
          <Plus size={18} /> Create Session
        </button>
      </motion.div>

      {/* SEARCH & FILTER */}
      <motion.div className="session-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-btn"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "var(--secondary)", color: "var(--accent)", cursor: "pointer" }}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </motion.div>

      {/* SESSION GRID */}
      <div className="session-grid">
        {filtered.length === 0 ? (
          <p style={{ opacity: 0.5, padding: "40px 0" }}>No sessions found.</p>
        ) : filtered.map((s, i) => (
          <motion.div key={i} className="session-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card-top">
              <span className="category">{s.category}</span>
              <span className={`status ${s.status.toLowerCase()}`}>{s.status}</span>
            </div>
            <h2>{s.title}</h2>
            <div className="info">
              <span><Clock size={15} />{s.time}</span>
              <span><MapPin size={15} />{s.location}</span>
              <span><Users size={15} />{s.attendees} Attendees</span>
            </div>
            <div className="speaker-box">
              <div className="avatar">{s.speaker.charAt(0)}</div>
              <div><p>Speaker</p><h4>{s.speaker}</h4></div>
            </div>
            <div className="card-buttons">
              <button className="join-btn" onClick={() => handleJoin(s.title)}>Join Session</button>
              <button className="save-btn" onClick={() => handleSave(s.title)}>Save</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CREATE SESSION MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="session-modal" initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}>
              <button className="close-btn" onClick={() => setOpenModal(false)}><X size={20} /></button>
              <h2>Create New Session 🎤</h2>
              <p>Fill in session details and invite attendees</p>

              <form className="session-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Session Title</label>
                  <input type="text" placeholder="Enter session title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label>Speaker Name</label>
                  <input type="text" placeholder="Enter speaker name" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} disabled={loading} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="Hall A" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} disabled={loading} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={loading}>
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Marketing</option>
                    <option>Startup</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="4" placeholder="Write session details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading}></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Session"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}