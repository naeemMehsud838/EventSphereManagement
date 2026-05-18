import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { boothAPI } from "../../api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Only booth count is fetched — everything else stays static
  const [boothCount, setBoothCount] = useState(4);

  useEffect(() => {
    boothAPI.getMyBooths()
      .then(({ count }) => { if (count !== undefined) setBoothCount(count); })
      .catch(() => {});
  }, []);

  const eventData = [
    { name: "Jan", events: 4  },
    { name: "Feb", events: 7  },
    { name: "Mar", events: 5  },
    { name: "Apr", events: 10 },
    { name: "May", events: 12 },
  ];

  const visitorData = [
    { name: "Mon", visitors: 120 },
    { name: "Tue", visitors: 220 },
    { name: "Wed", visitors: 180 },
    { name: "Thu", visitors: 300 },
    { name: "Fri", visitors: 260 },
  ];

  return (
    <div className="exhibitor-wrapper">

      {/* ================= MAIN AREA ================= */}
      <div className="main-area">

        {/* CONTENT */}
        <div className="content">

          {/* HEADER CARD */}
          <div className="card">
            <h1>👋 Exhibitor Dashboard</h1>
            <p>Analytics powered by your exhibitions</p>
          </div>

          {/* STATS */}
          <div className="stats-grid">

            <div
              className="card"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/exhibitor/ExhibitorEvents")}
            >
              <h2>🎪 Events</h2>
              <h3>12</h3>
            </div>

            <div
              className="card"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/exhibitor/My-Booth")}
            >
              <h2>🏗️ Booths</h2>
              <h3>{boothCount}</h3>
            </div>

            <div
              className="card"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/exhibitor/E-Attendee")}
            >
              <h2>👥 Attendees</h2>
              <h3>1,240</h3>
            </div>

          </div>

          {/* CHARTS */}
          <div className="charts-grid">

            <div className="card chart-card">
              <h2>📈 Events Growth</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={eventData}>
                  <XAxis dataKey="name" stroke="var(--accent)" />
                  <YAxis stroke="var(--accent)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="var(--primary)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card chart-card">
              <h2>👥 Weekly Attendee</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={visitorData}>
                  <XAxis dataKey="name" stroke="var(--accent)" />
                  <YAxis stroke="var(--accent)" />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="var(--deep)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}