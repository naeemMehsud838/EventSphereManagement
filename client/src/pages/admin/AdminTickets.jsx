// src/pages/admin/AdminTickets.jsx
import { useState, useEffect } from "react";
import { ticketAPI } from "../../api";
import "./AdminTickets.css";

// Original static tickets — shown as fallback if DB is empty
const STATIC_TICKETS = [
  { _id: "t1",  id: "#1021", user: "Ali",     subject: "Payment Issue",      status: "Open",    priority: "High",   category: "Billing",   date: "11 May" },
  { _id: "t2",  id: "#1022", user: "Ahmed",   subject: "Login Error",        status: "Pending", priority: "Medium", category: "Technical", date: "10 May" },
  { _id: "t3",  id: "#1023", user: "Sara",    subject: "Refund Request",     status: "Closed",  priority: "Low",    category: "Billing",   date: "09 May" },
  { _id: "t4",  id: "#1024", user: "Hassan",  subject: "Account Locked",     status: "Open",    priority: "High",   category: "Security",  date: "08 May" },
  { _id: "t5",  id: "#1025", user: "Areeba",  subject: "Profile Update",     status: "Pending", priority: "Low",    category: "General",   date: "07 May" },
  { _id: "t6",  id: "#1026", user: "Usman",   subject: "Subscription Error", status: "Closed",  priority: "Medium", category: "Billing",   date: "06 May" },
  { _id: "t7",  id: "#1027", user: "Fatima",  subject: "Password Reset",     status: "Open",    priority: "Medium", category: "Security",  date: "05 May" },
  { _id: "t8",  id: "#1028", user: "Bilal",   subject: "Website Crash",      status: "Open",    priority: "High",   category: "Technical", date: "04 May" },
  { _id: "t9",  id: "#1029", user: "Zoya",    subject: "Email Verification", status: "Pending", priority: "Medium", category: "General",   date: "03 May" },
  { _id: "t10", id: "#1030", user: "Hamza",   subject: "Refund Delay",       status: "Closed",  priority: "Low",    category: "Billing",   date: "02 May" },
  { _id: "t11", id: "#1031", user: "Iqra",    subject: "2FA Problem",        status: "Open",    priority: "High",   category: "Security",  date: "01 May" },
  { _id: "t12", id: "#1032", user: "Daniyal", subject: "Dashboard Bug",      status: "Pending", priority: "Medium", category: "Technical", date: "30 Apr" },
];

const STATIC_IDS = STATIC_TICKETS.map((t) => t._id);

const AdminTickets = () => {
  const [allTickets, setAllTickets] = useState(STATIC_TICKETS);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // ── Fetch real tickets from API ──
  useEffect(() => {
    ticketAPI.getAll()
      .then(({ tickets }) => {
        if (tickets?.length > 0) {
          // Shape DB tickets to match the same fields the UI expects
          const shaped = tickets.map((t, i) => ({
            _id:      t._id,
            id:       `#${1021 + i}`,
            user:     t.user?.name || "Unknown",
            subject:  t.subject,
            status:   t.status,
            priority: t.priority,
            category: t.category,
            date:     new Date(t.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          }));
          setAllTickets(shaped);
        }
      })
      .catch(() => {}); // keep static on error
  }, []);

  // ── Filter (same logic as original) ──
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || ticket.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tickets-page">
      {/* TOPBAR */}
      <div className="tickets-topbar">
        <h2>🎫 Support Tickets</h2>
        <div className="ticket-actions">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Security">Security</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="ticket-stats">
        <div className="stat-card"><span>Total</span>  <h4>{allTickets.length}</h4></div>
        <div className="stat-card"><span>Open</span>   <h4>{allTickets.filter((t) => t.status === "Open").length}</h4></div>
        <div className="stat-card"><span>Pending</span><h4>{allTickets.filter((t) => t.status === "Pending").length}</h4></div>
        <div className="stat-card"><span>Closed</span> <h4>{allTickets.filter((t) => t.status === "Closed").length}</h4></div>
      </div>

      {/* TABLE */}
      <div className="ticket-table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.id}</td>
                  <td>{ticket.user}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className={`status ${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.date}</td>
                  <td>
                    <button onClick={() => setSelectedTicket(ticket)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No Tickets Found 🔍</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {selectedTicket && (
        <div className="popup-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Ticket Details</h3>
            <div className="popup-details-grid">
              <div className="popup-detail"><strong>Ticket ID</strong><span>{selectedTicket.id}</span></div>
              <div className="popup-detail"><strong>User</strong>     <span>{selectedTicket.user}</span></div>
              <div className="popup-detail"><strong>Subject</strong>  <span>{selectedTicket.subject}</span></div>
              <div className="popup-detail"><strong>Category</strong> <span>{selectedTicket.category}</span></div>
              <div className="popup-detail"><strong>Status</strong>   <span>{selectedTicket.status}</span></div>
              <div className="popup-detail"><strong>Priority</strong> <span>{selectedTicket.priority}</span></div>
              <div className="popup-detail"><strong>Date</strong>     <span>{selectedTicket.date}</span></div>
            </div>
            <button className="close-popup-btn" onClick={() => setSelectedTicket(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;