// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import CreateEventModal from "../../components/events/CreateEventModal";
import { Link } from "react-router-dom";
import {
  CalendarDays, Users, Ticket, CreditCard,
  Bell, TrendingUp, Clock, MapPin,
} from "lucide-react";
import { eventAPI } from "../../api";

export default function AdminDashboard() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // ── Stats: start with original static values, replace with real ones ──
  const [stats, setStats] = useState([
    { title: "Total Events",  value: "28",    icon: <CalendarDays size={22} />, growth: "+12%", color: "rgba(255,255,255,0.15)"   },
    { title: "Attendees",     value: "12.4K", icon: <Users        size={22} />, growth: "+18%", color: "rgba(101, 214, 141, 0.2)" },
    { title: "Tickets Sold",  value: "8.2K",  icon: <Ticket       size={22} />, growth: "+9%",  color: "rgba(245, 158, 11, 0.2)"  },
    { title: "Revenue",       value: "$24.8K",icon: <CreditCard   size={22} />, growth: "+22%", color: "rgba(239, 68, 68, 0.2)"   },
  ]);

  // ── Events: start with original static list ──
  const [events, setEvents] = useState([
    { title: "Tech Expo 2026",    date: "12 May", location: "Convention Center", status: "Live"     },
    { title: "Startup Meetup",    date: "14 May", location: "Co-working Space",  status: "Upcoming" },
    { title: "Gaming Convention", date: "16 May", location: "Arena Hall",        status: "Draft"    },
  ]);

  // ── Schedule & notifications stay static (teacher approved) ──
  const schedule = [
    { time: "10:00 AM", task: "Team Meeting"      },
    { time: "12:30 PM", task: "Vendor Discussion" },
    { time: "03:00 PM", task: "Event Review"      },
    { time: "05:00 PM", task: "Publish Schedule"  },
  ];

  const notifications = [
    "5 new attendees registered",
    "Payment received for Tech Expo",
    "2 booths pending approval",
    "New support message received",
  ];

  // ── Chart data stays static ──
  const barData = [
    { label: "Jan", value: 45, amount: "$4.2K" },
    { label: "Feb", value: 65, amount: "$6.1K" },
    { label: "Mar", value: 55, amount: "$5.3K" },
    { label: "Apr", value: 80, amount: "$7.8K" },
    { label: "May", value: 70, amount: "$6.9K" },
    { label: "Jun", value: 95, amount: "$9.5K" },
  ];

  const lineData = [
    { month: "Jan", value: 4200  },
    { month: "Feb", value: 6100  },
    { month: "Mar", value: 5300  },
    { month: "Apr", value: 7800  },
    { month: "May", value: 8500  },
    { month: "Jun", value: 12400 },
  ];

  // ── Fetch real stats & events from API ──
  useEffect(() => {
    // Real stats
    eventAPI.adminStats()
      .then(({ stats: s }) => {
        const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
        setStats([
          { title: "Total Events",  value: String(s.totalEvents),           icon: <CalendarDays size={22} />, growth: "+12%", color: "rgba(255,255,255,0.15)"   },
          { title: "Attendees",     value: fmt(s.totalAttendees),           icon: <Users        size={22} />, growth: "+18%", color: "rgba(101, 214, 141, 0.2)" },
          { title: "Tickets Sold",  value: fmt(s.ticketsSold),              icon: <Ticket       size={22} />, growth: "+9%",  color: "rgba(245, 158, 11, 0.2)"  },
          { title: "Revenue",       value: `$${fmt(s.totalRevenue)}`,       icon: <CreditCard   size={22} />, growth: "+22%", color: "rgba(239, 68, 68, 0.2)"   },
        ]);
      })
      .catch(() => {}); // keep static values on error

    // Real recent events
    eventAPI.getAll()
      .then(({ events: ev }) => {
        if (ev?.length > 0) {
          setEvents(
            ev.slice(0, 3).map((e) => ({
              title:    e.title,
              date:     new Date(e.startDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
              location: e.location,
              status:   e.status === "ongoing" ? "Live" : e.status.charAt(0).toUpperCase() + e.status.slice(1),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleModalClose = () => setCreateModalOpen(false);

  const routes = [
    "/admin/adminEvents",
    "/admin/AdminAttendees",
    "/admin/AdminTickets",
    "/admin/AdminPayments",
  ];

  return (
    <>
      <style>{`
/* ================= ROOT ================= */
.dashboard-root{
  width:100%;
  display:flex;
  flex-direction:column; 
  gap:20px;
  padding:20px 0 30px;
}
/* ================= HEADER ================= */
.dash-header{
  position:relative;
  overflow:hidden;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:20px;
  padding:24px;
  border-radius:24px;
  background:var(--secondary);
  border:1px solid rgba(255,255,255,0.08);
}
/* ================= STATS ================= */
.stats-grid{
  display:flex;
  flex-wrap:nowrap;
  gap:12px;
  overflow-x:auto;
  padding-bottom:6px;
}
.stat-card{
  min-width:220px;
  flex:1;
  padding:14px;
  border-radius:16px;
  background:var(--secondary);
  border:1px solid rgba(255,255,255,0.08);
  transition:0.3s;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  gap:10px;
}
.stat-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.stat-icon{
  width:40px;
  height:40px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.stat-card h2{
  margin:0;
  color:white;
  font-size:20px;
  font-weight:800;
}
.stat-card p{
  margin:0;
  color:rgba(255,255,255,0.7);
  font-size:12px;
}
.growth{
  padding:4px 8px;
  font-size:10px;
  border-radius:20px;
  background:rgba(255,255,255,0.1);
  color:#a7f3d0;
}
/* ================= GRID ================= */
.dashboard-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:15px;
}
/* ================= CARDS ================= */
.dashboard-card,
.chart-box{
  padding:20px;
  border-radius:20px;
  background:var(--secondary);
  border:1px solid rgba(255,255,255,0.08);
  display:flex;
  flex-direction:column;
  gap:14px;
}
.card-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:10px;
}
.card-header h3{
  margin:0;
  color:white;
  font-size:16px;
  font-weight:700;
}
/* ================= EVENTS ================= */
.event-list,
.schedule-list,
.notify-list{
  display:flex;
  flex-direction:column;
  gap:12px;
}
.event-item,
.schedule-item,
.notify-item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding:14px;
  border-radius:14px;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.06);
  transition:0.25s;
}
.event-item:hover,
.schedule-item:hover,
.notify-item:hover{
  transform:translateX(5px);
  background:rgba(255,255,255,0.1);
}
.event-info h4{
  margin:0 0 4px;
  color:white;
  font-size:14px;
}
.event-meta{
  display:flex;
  gap:8px;
  align-items:center;
  flex-wrap:wrap;
}
.event-date{
  color:rgba(255,255,255,0.7);
  font-size:12px;
}
.status{
  padding:6px 12px;
  border-radius:20px;
  color:white;
  font-size:11px;
  font-weight:700;
}
/* ================= SCHEDULE ================= */
.schedule-time{
  min-width:80px;
  font-size:12px;
  padding:6px 10px;
  border-radius:10px;
  background:rgba(255,255,255,0.1);
  color:white;
  text-align:center;
  font-weight:600;
}
.schedule-task{
  color:rgba(255,255,255,0.85);
  font-size:13px;
}
/* ================= NOTIFICATIONS ================= */
.notify-icon{
  width:36px;
  height:36px;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(255,255,255,0.1);
}
/* ================= CHART GRID ================= */
.charts-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:15px;
}
.chart-box{
  min-height:320px;
  overflow:hidden;
}
.chart{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:12px;
  height:240px;
  margin-top:15px;
  padding:10px 0;
}
.bar-wrap{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-end;
  height:100%;
}
.bar{
  width:100%;
  max-width:28px;
  min-height:20px;
  border-radius:12px 12px 6px 6px;
  background:linear-gradient(180deg, rgba(255,255,255,0.85), rgba(139,92,246,0.35));
  border:1px solid rgba(255,255,255,0.15);
  transition:0.3s;
  position:relative;
  display:block;
}
.line-chart{
  position:relative;
  height:220px;
  border-radius:18px;
  background:rgba(255,255,255,0.05);
  overflow:hidden;
}
/* ================= RESPONSIVE ================= */
@media (max-width:1000px){
  .dashboard-grid,
  .charts-grid{ grid-template-columns:1fr; }
  .stats-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; }
  .stat-card{ min-width:unset; width:100%; }
}
@media (max-width:600px){
  .stats-grid{ grid-template-columns:1fr; }
  .stat-card{ width:100%; }
}`}</style>

      <div className="dashboard-root">
        {/* ================= HEADER ================= */}
        <div className="dash-header">
          <div className="dash-left">
            <div className="dash-title">
              <h1>👋 Dashboard Overview</h1>
              <p>Monitor events, attendees, revenue and schedules in real-time</p>
            </div>
          </div>
          <button className="dashboard-btn" onClick={() => setCreateModalOpen(true)}>
            + Create Event
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          {stats.map((item, index) => (
            <Link to={routes[index]} key={index} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: item.color }}>
                    {item.icon}
                  </div>
                </div>
                <h2>{item.value}</h2>
                <p>{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ================= EVENTS + SCHEDULE ================= */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Events</h3>
            </div>
            <div className="event-list">
              {events.map((event, index) => (
                <div className="event-item" key={index}>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <div className="event-meta">
                      <Clock size={16} />
                      <span className="event-date">{event.date}</span>
                      <MapPin size={16} />
                      <span className="event-date">{event.location}</span>
                    </div>
                  </div>
                  <div className={`status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Upcoming Schedule</h3>
            </div>
            <div className="schedule-list">
              {schedule.map((item, index) => (
                <div className="schedule-item" key={index}>
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-task">{item.task}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="charts-grid">
          <div className="chart-box">
            <div className="card-header">
              <h3>Revenue Analytics</h3>
              <TrendingUp size={20} />
            </div>
            <div className="chart">
              {barData.map((data, index) => (
                <div key={index} className="bar-wrap">
                  <div className="bar" style={{ height: `${data.value}%` }} data-amount={data.amount}></div>
                  <div className="bar-label">{data.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-box">
            <div className="card-header">
              <h3>Attendee Growth</h3>
              <TrendingUp size={20} />
            </div>
            <div className="line-chart">
              <div className="line">
                <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%"   stopColor="rgba(167,139,250,0.3)" />
                      <stop offset="100%" stopColor="rgba(139,92,246,0.05)" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="rgba(255,255,255,0.9)" />
                      <stop offset="50%"  stopColor="rgba(167,139,250,0.9)" />
                      <stop offset="100%" stopColor="rgba(139,92,246,0.8)"  />
                    </linearGradient>
                  </defs>
                  <path d="M20 140 Q85 110, 150 95 Q215 85, 280 100 Q345 115, 380 65 L380 200 L20 200 Z" fill="url(#areaGradient)" opacity="0.6" />
                  <path d="M20 140 Q85 110, 150 95 Q215 85, 280 100 Q345 115, 380 65" fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20"  cy="140" r="5" fill="#fff" className="data-point" />
                  <circle cx="100" cy="105" r="5" fill="#fff" className="data-point" />
                  <circle cx="180" cy="92"  r="5" fill="#fff" className="data-point" />
                  <circle cx="260" cy="88"  r="5" fill="#fff" className="data-point" />
                  <circle cx="330" cy="108" r="5" fill="#fff" className="data-point" />
                  <circle cx="380" cy="65"  r="5" fill="#fff" className="data-point" />
                </svg>
              </div>
              <div className="chart-stats">
                {lineData.map((data, index) => (
                  <div key={index} className="chart-stat-item">
                    <div className="chart-stat-label">{data.month}</div>
                    <div className="chart-stat-value">{(data.value / 1000).toFixed(1)}K</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Notifications</h3>
          </div>
          <div className="notify-list">
            {notifications.map((note, index) => (
              <div className="notify-item" key={index}>
                <div className="notify-icon"><Bell size={20} /></div>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateEventModal open={createModalOpen} onClose={handleModalClose} onCreated={handleModalClose} />
    </>
  );
}