import { useState, useEffect } from "react";
import "./AdminExhibitors.css";
import { userAPI, boothAPI } from "../../api";

// ── Original static exhibitors ──
const STATIC_EXHIBITORS = [
  { id: 1, name: "Ali Khan",    email: "ali@gmail.com",    company: "TechNova"    },
  { id: 2, name: "Sara Ahmed",  email: "sara@gmail.com",   company: "Eventify"    },
  { id: 3, name: "Usman Tariq", email: "usman@gmail.com",  company: "BrightMedia" },
  { id: 4, name: "Ayesha Noor", email: "ayesha@gmail.com", company: "DesignHub"   },
  { id: 5, name: "Hassan Ali",  email: "hassan@gmail.com", company: "SoftCore"    },
  { id: 6, name: "Fatima Zia",  email: "fatima@gmail.com", company: "MarketPro"   },
  { id: 7, name: "Bilal Shah",  email: "bilal@gmail.com",  company: "NextGen"     },
];

export default function ExhibitorAdmin() {
  const [activeUser,     setActiveUser]     = useState(null);
  const [exhibitorsData, setExhibitorsData] = useState(STATIC_EXHIBITORS);
  const [pendingBooths,  setPendingBooths]  = useState([]);
  const [actionId,       setActionId]       = useState(null);

  useEffect(() => {
    // Fetch real exhibitors
    userAPI.getAll("exhibitor")
      .then(({ users }) => {
        if (users?.length > 0) {
          setExhibitorsData(
            users.map((u, i) => ({
              id:      i + 1,
              name:    u.name,
              email:   u.email,
              company: u.company || "—",
            }))
          );
        }
      })
      .catch(() => {});

    // Fetch pending booths
    boothAPI.getAll({ status: "pending" })
      .then(({ booths }) => {
        if (booths?.length > 0) setPendingBooths(booths);
      })
      .catch(() => {});
  }, []);

  const handleBoothAction = async (id, status) => {
    setActionId(id);
    try {
      await boothAPI.updateStatus(id, status);
      setPendingBooths((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="exh-page">

      {/* ── HEADER (original) ── */}
      <header className="exh-header">
        <h1 className="exh-title">🎪 Exhibitor Management</h1>
        <p className="exh-subtitle">
          📊 Manage all exhibitors in a structured table view
        </p>
      </header>

      {/* ── STATS (original) ── */}
      <section className="exh-stats">
        <div className="exh-stat-box">
          <span>👥 Total Exhibitors</span>
          <h2>{exhibitorsData.length}</h2>
        </div>
        <div className="exh-stat-box">
          <span>📅 Active Events</span>
          <h2>3</h2>
        </div>
        <div className="exh-stat-box">
          <span>⏳ Pending Booths</span>
          <h2>{pendingBooths.length}</h2>
        </div>
        <div className="exh-stat-box">
          <span>💰 Revenue</span>
          <h2>$24K</h2>
        </div>
      </section>

      {/* ── EXHIBITORS TABLE (original, untouched) ── */}
      <section className="exh-table-wrapper">
        <table className="exh-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exhibitorsData.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>
                  <button className="exh-btn" onClick={() => setActiveUser(user)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── PENDING BOOTH APPROVALS (new section, only shows when there are pending booths) ── */}
      {pendingBooths.length > 0 && (
        <section className="exh-table-wrapper" style={{ marginTop: "24px" }}>
          <h2 style={{ padding: "0 0 16px", fontSize: "18px", fontWeight: 700 }}>
            🏗️ Pending Booth Approvals ({pendingBooths.length})
          </h2>
          <table className="exh-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Booth Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Exhibitor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingBooths.map((booth, index) => (
                <tr key={booth._id}>
                  <td>{index + 1}</td>
                  <td>{booth.name}</td>
                  <td>{booth.category}</td>
                  <td>{booth.location}</td>
                  <td>{booth.exhibitor?.name || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="exh-btn"
                        style={{ background: "rgba(52,211,153,0.2)", color: "#34d399", borderColor: "#34d399" }}
                        onClick={() => handleBoothAction(booth._id, "approved")}
                        disabled={actionId === booth._id}
                      >
                        {actionId === booth._id ? "..." : "Approve"}
                      </button>
                      <button
                        className="exh-btn"
                        style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", borderColor: "#f87171" }}
                        onClick={() => handleBoothAction(booth._id, "rejected")}
                        disabled={actionId === booth._id}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ── MODAL (original, untouched) ── */}
      {activeUser && (
        <div className="exh-modal" onClick={() => setActiveUser(null)}>
          <div className="exh-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Exhibitor Profile</h2>
            <div className="exh-modal-content">
              <p><b>Name:</b>    {activeUser.name}</p>
              <p><b>Email:</b>   {activeUser.email}</p>
              <p><b>Company:</b> {activeUser.company}</p>
            </div>
            <button onClick={() => setActiveUser(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}