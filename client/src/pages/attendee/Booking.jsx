import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin, CheckCircle, Download, Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "./Booking.css";
import { bookingAPI } from "../../api";

const STATIC_BOOKINGS = [
  { _id: "s1", title: "AI & Future Tech",     date: "12 June 2026", time: "10:00 AM", location: "Hall A", status: "Confirmed", ticket: "#AI2026" },
  { _id: "s2", title: "Startup Growth Hacks", date: "12 June 2026", time: "12:00 PM", location: "Hall B", status: "Pending",   ticket: "#SG4501" },
  { _id: "s3", title: "Web3 Workshop",        date: "12 June 2026", time: "2:00 PM",  location: "Hall C", status: "Confirmed", ticket: "#WB8877" },
];
const STATIC_IDS = ["s1", "s2", "s3"];

export default function Bookings() {
  const [bookings, setBookings] = useState(STATIC_BOOKINGS);

  useEffect(() => {
    bookingAPI.getMy()
      .then(({ bookings: b }) => {
        if (b?.length > 0) {
          setBookings(b.map((item) => ({
            _id:      item._id,
            title:    item.event?.title || "Event",
            date:     item.event?.startDate
              ? new Date(item.event.startDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
              : "—",
            time:     item.sessionTime  || "—",
            location: item.hallLocation || item.event?.location || "—",
            status:   item.status,
            ticket:   `#${item._id.toString().slice(-6).toUpperCase()}`,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const total     = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const pending   = bookings.filter((b) => b.status === "Pending").length;

  const handleView = (b) => {
    Swal.fire({
      title: "🎟️ Booking Details",
      html: `<div style="text-align:left;line-height:2.2;font-size:15px">
        <p><b>Event:</b> ${b.title}</p>
        <p><b>Date:</b> ${b.date}</p>
        <p><b>Time:</b> ${b.time}</p>
        <p><b>Location:</b> ${b.location}</p>
        <p><b>Status:</b> ${b.status}</p>
        <p><b>Ticket ID:</b> ${b.ticket}</p>
      </div>`,
      confirmButtonText: "Close",
      background: "#1e1e2e",
      color: "#fff",
      confirmButtonColor: "#7c3aed",
    });
  };

  const handleDownload = (b) => {
    const content = `EventSphere Ticket\n==================\nEvent: ${b.title}\nDate: ${b.date}\nTime: ${b.time}\nLocation: ${b.location}\nStatus: ${b.status}\nTicket ID: ${b.ticket}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${b.ticket}-ticket.txt`; a.click();
    URL.revokeObjectURL(url);
    Swal.fire({ title: "Downloaded!", text: `Ticket ${b.ticket} saved.`, icon: "success", timer: 1500, showConfirmButton: false, background: "#1e1e2e", color: "#fff" });
  };

  const handleCancel = async (b) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: `Cancel "${b.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7c3aed",
      background: "#1e1e2e",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    if (STATIC_IDS.includes(b._id)) {
      setBookings((prev) => prev.filter((x) => x._id !== b._id));
      Swal.fire({ title: "Cancelled!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e1e2e", color: "#fff" });
      return;
    }

    try {
      await bookingAPI.cancel(b._id);
      setBookings((prev) => prev.map((x) => x._id === b._id ? { ...x, status: "Cancelled" } : x));
      Swal.fire({ title: "Cancelled!", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e1e2e", color: "#fff" });
    } catch (err) {
      Swal.fire({ title: "Failed", text: err.message, icon: "error", background: "#1e1e2e", color: "#fff" });
    }
  };

  return (
    <div className="booking-page">
      <motion.div className="booking-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1>My Bookings 🎟️</h1>
        <p>View your registered sessions, tickets, and event schedule</p>
      </motion.div>

      <div className="booking-stats">
        <div className="stat-card"><h2>{String(total).padStart(2,"0")}</h2><p>Total Bookings</p></div>
        <div className="stat-card"><h2>{String(confirmed).padStart(2,"0")}</h2><p>Confirmed</p></div>
        <div className="stat-card"><h2>{String(pending).padStart(2,"0")}</h2><p>Pending</p></div>
      </div>

      <div className="booking-grid">
        {bookings.map((b, i) => (
          <motion.div key={b._id || i} className="booking-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card-top">
              <div className="ticket-badge"><Ticket size={16} /> Ticket</div>
              <div className={`status ${b.status.toLowerCase()}`}><CheckCircle size={14} />{b.status}</div>
            </div>
            <h2>{b.title}</h2>
            <div className="info">
              <span><Calendar size={15} />{b.date} • {b.time}</span>
              <span><MapPin size={15} />{b.location}</span>
            </div>
            <div className="ticket-number">Ticket ID: <strong>{b.ticket}</strong></div>
            <div className="booking-actions">
              <button className="view-btn"     onClick={() => handleView(b)}><Eye size={16} /> View</button>
              <button className="download-btn" onClick={() => handleDownload(b)}><Download size={16} /> Download</button>
              {b.status !== "Cancelled" && (
                <button className="cancel-btn" onClick={() => handleCancel(b)}><Trash2 size={16} /> Cancel</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}