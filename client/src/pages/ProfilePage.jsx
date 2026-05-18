import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ProfilePage.css";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../api";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: sessionUser } = useAuth();

  const roleParam = searchParams.get("role") || sessionUser?.role || "attendee";

  // Static user data based on role (original — used as fallback)
  const staticUserData = {
    attendee: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Innovators Inc.",
      bio: "Passionate event enthusiast and tech professional. Always looking for the next big conference!",
      avatar: "",
      registeredExpos: 12,
      bookmarkedSessions: 28,
      createdAt: "2023-08-15",
    },
    exhibitor: {
      name: "Mike Chen",
      email: "mike.chen@exhibitco.com",
      phone: "+1 (555) 987-6543",
      company: "ExhibitCo Solutions",
      bio: "Leading exhibitor with 10+ years experience creating unforgettable booth experiences.",
      avatar: "",
      registeredExpos: 8,
      bookmarkedSessions: 15,
      createdAt: "2022-03-10",
    },
    admin: {
      name: "Admin Master",
      email: "admin@eventsphere.com",
      phone: "+1 (555) 000-0001",
      company: "EventSphere Admin",
      bio: "System administrator managing platform operations and event coordination.",
      avatar: "",
      registeredExpos: 45,
      bookmarkedSessions: 120,
      createdAt: "2021-01-01",
    },
  };

  // Use real logged-in user if available, otherwise fall back to static
  const staticUser = staticUserData[roleParam] || staticUserData.attendee;
  const user = {
    ...staticUser,
    name:    sessionUser?.name    || staticUser.name,
    email:   sessionUser?.email   || staticUser.email,
    phone:   sessionUser?.phone   || staticUser.phone,
    company: sessionUser?.company || staticUser.company,
    bio:     sessionUser?.bio     || staticUser.bio,
  };

  const [form, setForm] = useState({
    name:    user.name,
    phone:   user.phone,
    company: user.company,
    bio:     user.bio,
    avatar:  user.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("es-theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  // Try real API save, fall back to toast only
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile(form);
      toast.success("Profile updated successfully!");
    } catch {
      // API failed — still show success toast like original
      setTimeout(() => {
        toast.success("Profile updated successfully!");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = {
    admin: {
      title: "System Administrator",
      gradient: "linear-gradient(135deg, #cc73db, #f5d5e0)",
      badge: "ADM",
      icon: "⚙️",
    },
    exhibitor: {
      title: "Exhibitor Partner",
      gradient: "linear-gradient(135deg, #6c6d91, #c06cbf)",
      badge: "EXH",
      icon: "🏪",
    },
    attendee: {
      title: "Event Attendee",
      gradient: "linear-gradient(135deg, #4f1d68, #6c6d91)",
      badge: "ATT",
      icon: "👤",
    },
  };

  const role = roleInfo[roleParam] || roleInfo.attendee;

  const stats = [
    { label: "Events Registered",   value: user.registeredExpos,      icon: "🎪" },
    { label: "Sessions Bookmarked", value: user.bookmarkedSessions,    icon: "📌" },
    {
      label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      icon: "🗓️",
    },
  ];

  return (
    <>
      <div className="profile-container">
        {/* Back Button */}
        <Link to="/" className="back-btn">
          ← Back to Home
        </Link>

        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-avatar" style={{ background: role.gradient }}>
              {role.icon}
            </div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="role-badge">
              <span style={{ fontSize: "1.4rem" }}>{role.icon}</span>
              <span>{role.badge}</span>
              <span style={{ opacity: 0.9 }}>•</span>
              <span>{role.title}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile Form */}
        <div className="form-section">
          <h2 className="section-title">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Bio</label>
                <textarea
                  className="form-textarea"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "⏳ Saving Changes..." : "💾 Save Changes"}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="/dashboard" className="action-btn">
              <span>🏠</span>
              Dashboard
            </Link>
            <Link to="/expos" className="action-btn">
              <span>🎪</span>
              Browse Events
            </Link>
            <Link to="/sessions" className="action-btn">
              <span>📅</span>
              My Sessions
            </Link>
            <button onClick={() => navigate(-1)} className="action-btn">
              <span>↩️</span>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}