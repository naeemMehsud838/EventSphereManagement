import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, User, Plus, CalendarDays, Bell, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import "./Schedule.css";
import { scheduleAPI } from "../../api";

const schedule = [
  { time: "10:00 AM", title: "AI & Future Tech",    speaker: "Dr. Ahmed Khan", location: "Hall A",   status: "Upcoming"   },
  { time: "12:00 PM", title: "Startup Growth Hacks", speaker: "Sara Ali",       location: "Hall B",   status: "Live"       },
  { time: "2:00 PM",  title: "Web3 Workshop",        speaker: "John Smith",     location: "Hall C",   status: "Popular"    },
  { time: "4:00 PM",  title: "Networking Session",   speaker: "Panel Team",     location: "Main Hall", status: "Networking" },
];

export default function Schedule() {
  const [openModal, setOpenModal] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [form, setForm] = useState({ name: "", day: "Day 1", sessions: "", reminderTime: "" });

  const handleAddSchedule = (title) => {
    Swal.fire({
      title: "📅 Added to Schedule!",
      text: `"${title}" has been added to your personal schedule!`,
      icon: "success",
      confirmButtonColor: "#7c3aed",
      background: "#1e1e2e",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleReminder = (title) => {
    Swal.fire({
      title: "⏰ Reminder Set!",
      text: `You'll be reminded before "${title}" starts.`,
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
        event: form.name,
        time:  form.reminderTime || "09:00",
        emoji: "📅",
        date:  new Date().toISOString().split("T")[0],
      });
      setOpenModal(false);
      setForm({ name: "", day: "Day 1", sessions: "", reminderTime: "" });
      Swal.fire({ title: "Schedule Saved!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e1e2e", color: "#fff" });
    } catch (err) {
      Swal.fire({ title: "Failed", text: err.message, icon: "error", background: "#1e1e2e", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-page">

      <motion.div className="schedule-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1>My Event Schedule 📅</h1>
          <p>Organize your sessions and create your personal agenda</p>
        </div>
        <button className="create-schedule-btn" onClick={() => setOpenModal(true)}>
          <Plus size={18} /> Create Schedule
        </button>
      </motion.div>

      <div className="timeline">
        {schedule.map((item, i) => (
          <motion.div key={i} className="schedule-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card-top">
              <div className="time"><Clock size={16} />{item.time}</div>
              <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
            </div>
            <h2>{item.title}</h2>
            <div className="meta">
              <span><User size={14} />{item.speaker}</span>
              <span><MapPin size={14} />{item.location}</span>
            </div>
            <div className="schedule-actions">
              <button className="add-btn" onClick={() => handleAddSchedule(item.title)}>
                <CalendarDays size={16} /> Add Schedule
              </button>
              <button className="reminder-btn" onClick={() => handleReminder(item.title)}>
                <Bell size={16} /> Reminder
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CREATE SCHEDULE MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="schedule-modal" initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}>
              <button className="close-btn" onClick={() => setOpenModal(false)}><X size={20} /></button>
              <h2>Create Personal Schedule 📅</h2>
              <p>Plan your event journey and never miss important sessions</p>

              <form className="schedule-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Schedule Name</label>
                  <input type="text" placeholder="My Tech Schedule" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label>Select Event Day</label>
                  <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} disabled={loading}>
                    <option>Day 1</option>
                    <option>Day 2</option>
                    <option>Day 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Sessions</label>
                  <textarea rows="4" placeholder="Add sessions you want to attend..." value={form.sessions} onChange={(e) => setForm({ ...form, sessions: e.target.value })} disabled={loading}></textarea>
                </div>
                <div className="form-group">
                  <label>Reminder Time</label>
                  <input type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} disabled={loading} />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Schedule"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}