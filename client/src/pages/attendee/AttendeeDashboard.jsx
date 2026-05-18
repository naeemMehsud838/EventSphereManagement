import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Ticket, Users, Bell } from "lucide-react";
import "./AttendeeDashboard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookingAPI } from "../../api";

export default function AttendeeDashboard() {
  const { user } = useAuth();
  const [bookedCount, setBookedCount] = useState(3);

  useEffect(() => {
    bookingAPI.getMy()
      .then(({ count }) => { if (count !== undefined) setBookedCount(count); })
      .catch(() => {});
  }, []);

  // First name only for the greeting
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="dashboard">
      {/* HEADER */}
      <motion.div
        className="dash-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Welcome, {firstName} 👋</h1>
        <p>Here's what's happening at your events today</p>
      </motion.div>

      {/* STATS */}
      <div className="grid">
        <Link to="/attendee/schedule" className="card-link">
          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <div className="card-top">
              <div>
                <h2>12</h2>
                <span>Registered Events</span>
              </div>
              <div className="icon-box">
                <Calendar size={18} />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/attendee/session" className="card-link">
          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <div className="card-top">
              <div>
                <h2>5</h2>
                <span>Upcoming Sessions</span>
              </div>
              <div className="icon-box">
                <Users size={18} />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/attendee/booking" className="card-link">
          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <div className="card-top">
              <div>
                <h2>{bookedCount}</h2>
                <span>Booked Tickets</span>
              </div>
              <div className="icon-box">
                <Ticket size={18} />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/attendee/attendeeMessage" className="card-link">
          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <div className="card-top">
              <div>
                <h2>2</h2>
                <span>Notifications</span>
              </div>
              <div className="icon-box">
                <Bell size={18} />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* BOTTOM */}
      <div className="bottom">
        <div className="panel">
          <h3>Upcoming Events</h3>

          <div className="event">
            <span>Tech Expo 2026</span>
            <span className="badge">Tomorrow</span>
          </div>

          <div className="event">
            <span>AI Summit</span>
            <span className="badge">3 Days</span>
          </div>

          <div className="event">
            <span>Startup Meetup</span>
            <span className="badge">1 Week</span>
          </div>
        </div>

        <div className="panel">
          <h3>Quick Actions</h3>
          <p className="muted">Jump quickly to important sections</p>

          <div className="actions">
            <Link to="/attendee/schedule" className="badge-link">
              <button className="badge">Browse Events</button>
            </Link>

            <Link to="/attendee/booking" className="badge-link">
              <button className="badge">My Bookings</button>
            </Link>

            <Link to="/attendee/attendeeMessage" className="badge-link">
              <button className="badge">Messages</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}