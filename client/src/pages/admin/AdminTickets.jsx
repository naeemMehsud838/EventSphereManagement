// src/pages/admin/AdminTickets.jsx
import { useState, useEffect } from "react";
import { ticketAPI } from "../../api";
import "./AdminTickets.css";

const STATIC_TICKETS = [
  { subject: "Payment Issue",      status: "Open",    priority: "High",   category: "Billing",   userName: "Ali"     },
  { subject: "Login Error",        status: "Pending", priority: "Medium", category: "Technical", userName: "Ahmed"   },
  { subject: "Refund Request",     status: "Closed",  priority: "Low",    category: "Billing",   userName: "Sara"    },
  { subject: "Account Locked",     status: "Open",    priority: "High",   category: "Security",  userName: "Hassan"  },
  { subject: "Profile Update",     status: "Pending", priority: "Low",    category: "General",   userName: "Areeba"  },
  { subject: "Subscription Error", status: "Closed",  priority: "Medium", category: "Billing",   userName: "Usman"   },
  { subject: "Password Reset",     status: "Open",    priority: "Medium", category: "Security",  userName: "Fatima"  },
  { subject: "Website Crash",      status: "Open",    priority: "High",   category: "Technical", userName: "Bilal"   },
  { subject: "Email Verification", status: "Pending", priority: "Medium", category: "General",   userName: "Zoya"    },
  { subject: "Refund Delay",       status: "Closed",  priority: "Low",    category: "Billing",   userName: "Hamza"   },
  { subject: "2FA Problem",        status: "Open",    priority: "High",   category: "Security",  userName: "Iqra"    },
  { subject: "Dashboard Bug",      status: "Pending", priority: "Medium", category: "Technical", userName: "Daniyal" },
];

const AdminTickets = () => {
  const [allTickets,     setAllTickets]     = useState([]);
  const [search,         setSearch]         = useState("");
  const [category,       setCategory]       = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [seeding,        setSeeding]        = useState(true);

  useEffect(() => {
    // Try to load from DB first
    ticketAPI.getAll()
      .then(async ({ tickets }) => {
        if (tickets?.length > 0) {
          // DB already has tickets — shape and show them
          setAllTickets(tickets.map((t, i) => ({
            _id:      t._id,
            id:       `#${1021 + i}`,
            user:     t.user?.name || t.userName || "Unknown",
            subject:  t.subject,
            status:   t.status,
            priority: t.priority,
            category: t.category,
            date:     new Date(t.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          })));
        } else {
          // DB is empty — seed the static tickets into DB
          await seedTickets();
        }
      })
      .catch(() => {
        // API error — show static fallback shaped for UI
        setAllTickets(STATIC_TICKETS.map((t, i) => ({
          _id:      `static-${i}`,
          id:       `#${1021 + i}`,
          user:     t.userName,
          subject:  t.subject,
          status:   t.status,
          priority: t.priority,
          category: t.category,
          date:     "—",
        })));
      })
      .finally(() => setSeeding(false));
  }, []);

  const seedTickets = async () => {
    try {
      // Create all static tickets in DB
      const created = await Promise.all(
        STATIC_TICKETS.map((t) =>
          ticketAPI.create({
            subject:     t.subject,
            category:    t.category,
            priority:    t.priority,
            description: `Support ticket: ${t.subject}`,
          })
        )
      );

      // Reload from DB after seeding
      const { tickets } = await ticketAPI.getAll();
      if (tickets?.length > 0) {
        setAllTickets(tickets.map((t, i) => ({
          _id:      t._id,
          id:       `#${1021 + i}`,
          user:     t.user?.name || "Support",
          subject:  t.subject,
          status:   t.status,
          priority: t.priority,
          category: t.category,
          date:     new Date(t.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        })));
      }
    } catch {
      // Seed failed — show static fallback
      setAllTickets(STATIC_TICKETS.map((t, i) => ({
        _id:      `static-${i}`,
        id:       `#${1021 + i}`,
        user:     t.userName,
        subject:  t.subject,
        status:   t.status,
        priority: t.priority,
        category: t.category,
        date:     "—",
      })));
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (ticketId.startsWith("static-")) return;
    try {
      await ticketAPI.updateStatus(ticketId, newStatus);
      setAllTickets((prev) =>
        prev.map((t) => t._id === ticketId ? { ...t, status: newStatus } : t)
      );
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || ticket.category === category;
    return matchesSearch && matchesCategory;
  });

  if (seeding) return <div style={{ color: "white", padding: "40px", opacity: 0.6 }}>Loading tickets...</div>;

  return (
    <div className="tickets-page">
      {/* TOPBAR */}
      <div className="tickets-topbar">
        <h2>🎫 Support Tickets</h2>
        <div className="ticket-actions">
          <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <th>ID</th><th>User</th><th>Subject</th><th>Category</th>
              <th>Status</th><th>Priority</th><th>Date</th><th>Action</th>
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
                  <td><span className={`status ${ticket.status.toLowerCase()}`}>{ticket.status}</span></td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.date}</td>
                  <td><button onClick={() => setSelectedTicket(ticket)}>View</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="no-data">No Tickets Found 🔍</td></tr>
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
              <div className="popup-detail"><strong>Status</strong>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                  style={{ padding: "4px 8px", borderRadius: "6px", background: "var(--secondary)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <option>Open</option>
                  <option>Pending</option>
                  <option>Closed</option>
                </select>
              </div>
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