import { useState, useEffect } from "react";
import "./AdminAttendees.css";
import { userAPI } from "../../api";

const STATIC_REQUESTS = [
  { _id: "r1", name: "Ali Khan",    event: "New Registration", email: "ali@gmail.com"   },
  { _id: "r2", name: "Sara Ahmed",  event: "New Registration", email: "sara@gmail.com"  },
  { _id: "r3", name: "Usman Tariq", event: "New Registration", email: "usman@gmail.com" },
  { _id: "r4", name: "Hina Malik",  event: "New Registration", email: "hina@gmail.com"  },
];

const STATIC_ATTENDEES = [
  { name: "Usman Ali",    event: "React Workshop",    email: "usman@gmail.com",  location: "Karachi",   status: "Approved" },
  { name: "Hina Malik",   event: "Design Conference", email: "hina@gmail.com",   location: "Lahore",    status: "Approved" },
  { name: "Zain Raza",    event: "Startup Meetup",    email: "zain@gmail.com",   location: "Islamabad", status: "Pending"  },
  { name: "Ayesha Noor",  event: "Cyber Security",    email: "ayesha@gmail.com", location: "Karachi",   status: "Approved" },
  { name: "Bilal Hassan", event: "Cloud Summit",      email: "bilal@gmail.com",  location: "Peshawar",  status: "Approved" },
  { name: "Sana Iqbal",   event: "AI Workshop",       email: "sana@gmail.com",   location: "Quetta",    status: "Pending"  },
];

const STATIC_IDS = ["r1", "r2", "r3", "r4"];

const AdminAttendeePage = () => {
  const [requests,  setRequests]  = useState(STATIC_REQUESTS);
  const [attendees, setAttendees] = useState(STATIC_ATTENDEES);
  const [actionId,  setActionId]  = useState(null);

  useEffect(() => {
    // Fetch ONLY pending attendees for requests section
    userAPI.getAll("attendee", "pending")
      .then(({ users }) => {
        if (users?.length > 0) {
          setRequests(
            users.map((u) => ({
              _id:   u._id,
              name:  u.name,
              event: "New Registration",
              email: u.email,
            }))
          );
        }
      })
      .catch(() => {});

    // Fetch ONLY approved attendees for registered section
    userAPI.getAll("attendee", "approved")
      .then(({ users }) => {
        if (users?.length > 0) {
          setAttendees(
            users.map((u) => ({
              name:     u.name,
              event:    "—",
              email:    u.email,
              location: u.phone || "—",
              status:   "Approved",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleAction = async (id, action) => {
    if (STATIC_IDS.includes(id)) return;
    setActionId(id);
    try {
      if (action === "approve") {
        await userAPI.updateStatus(id, "approved");
        // Move from requests to attendees table
        const approved = requests.find((r) => r._id === id);
        setRequests((prev) => prev.filter((r) => r._id !== id));
        if (approved) {
          setAttendees((prev) => [...prev, {
            name:     approved.name,
            event:    "—",
            email:    approved.email,
            location: "—",
            status:   "Approved",
          }]);
        }
      } else {
        // Reject — mark as rejected (NOT delete) so they get a clear message on login
        await userAPI.updateStatus(id, "rejected");
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="admin-attendee-page">

      {/* BANNER (original) */}
      <div className="attendee-banner">
        <div className="banner-left">
          <span className="banner-icon">👥</span>
          <div>
            <h1>Attendee Management</h1>
            <p>Manage requests and registered attendees</p>
          </div>
        </div>
      </div>

      {/* REQUESTS (original structure) */}
      <div className="section-card">
        <h2> ⏳ Pending Requests</h2>
        <div className="request-list">
          {requests.length === 0 ? (
            <p style={{ opacity: 0.5, padding: "16px 0" }}>No pending requests 🎉</p>
          ) : (
            requests.map((item, index) => (
              <div className="request-card" key={item._id || index}>
                <div>
                  <h3>{item.name}</h3>
                  <small>{item.event}</small>
                  <br />
                  <small>{item.email}</small>
                </div>
                <div className="request-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleAction(item._id, "approve")}
                    disabled={actionId === item._id}
                  >
                    {actionId === item._id ? "..." : "Approve"}
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAction(item._id, "reject")}
                    disabled={actionId === item._id}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ATTENDEES TABLE (original structure) */}
      <div className="section-card">
        <h2> ✅ Registered Attendees</h2>
        <div className="table">
          <div className="table-header">
            <span>Name</span>
            <span>Event</span>
            <span>Email</span>
            <span>Location</span>
            <span>Status</span>
          </div>
          {attendees.map((item, index) => (
            <div className="table-row" key={index}>
              <span>{item.name}</span>
              <span>{item.event}</span>
              <span>{item.email}</span>
              <span>{item.location}</span>
              <span className={item.status.toLowerCase()}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminAttendeePage;