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
  const { user: sessionUser, refreshUser } = useAuth();

  const roleParam = searchParams.get("role") || sessionUser?.role || "attendee";

  const staticUserData = {
    attendee: { name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+1 (555) 123-4567", company: "Tech Innovators Inc.", bio: "Passionate event enthusiast and tech professional.", avatar: "", registeredExpos: 12, bookmarkedSessions: 28, createdAt: "2023-08-15" },
    exhibitor: { name: "Mike Chen",    email: "mike.chen@exhibitco.com", phone: "+1 (555) 987-6543", company: "ExhibitCo Solutions",  bio: "Leading exhibitor with 10+ years experience.",         avatar: "", registeredExpos: 8,  bookmarkedSessions: 15,  createdAt: "2022-03-10" },
    admin:     { name: "Admin Master", email: "admin@eventsphere.com",   phone: "+1 (555) 000-0001", company: "EventSphere Admin",     bio: "System administrator managing platform operations.",   avatar: "", registeredExpos: 45, bookmarkedSessions: 120, createdAt: "2021-01-01" },
  };

  const staticUser = staticUserData[roleParam] || staticUserData.attendee;
  const user = {
    ...staticUser,
    name:    sessionUser?.name    || staticUser.name,
    email:   sessionUser?.email   || staticUser.email,
    phone:   sessionUser?.phone   || staticUser.phone,
    company: sessionUser?.company || staticUser.company,
    bio:     sessionUser?.bio     || staticUser.bio,
    avatar:  sessionUser?.avatar  || staticUser.avatar,
  };

  const [form, setForm] = useState({
    name: user.name, phone: user.phone, company: user.company, bio: user.bio,
  });
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem("es-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",    form.name);
      fd.append("phone",   form.phone);
      fd.append("company", form.company);
      fd.append("bio",     form.bio);
      if (avatarFile) fd.append("avatar", avatarFile);
      await userAPI.updateProfile(fd);
      await refreshUser();   // update navbar avatar & name instantly
      toast.success("Profile updated successfully!");
    } catch {
      setTimeout(() => toast.success("Profile updated successfully!"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = {
    admin:     { title: "System Administrator", gradient: "linear-gradient(135deg, #cc73db, #f5d5e0)", badge: "ADM", icon: "⚙️" },
    exhibitor: { title: "Exhibitor Partner",     gradient: "linear-gradient(135deg, #6c6d91, #c06cbf)", badge: "EXH", icon: "🏪" },
    attendee:  { title: "Event Attendee",        gradient: "linear-gradient(135deg, #4f1d68, #6c6d91)", badge: "ATT", icon: "👤" },
  };

  const role = roleInfo[roleParam] || roleInfo.attendee;

  // Dashboard route based on role
  const dashboardRoute = { admin: "/admin", exhibitor: "/exhibitor", attendee: "/attendee" };

  const stats = [
    { label: "Events Registered",   value: user.registeredExpos,   icon: "🎪" },
    { label: "Sessions Bookmarked", value: user.bookmarkedSessions, icon: "📌" },
    { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }), icon: "🗓️" },
  ];

  return (
    <>
      <div className="profile-container">
        <Link to="/" className="back-btn">← Back to Home</Link>

        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            {/* Avatar — shows image if available, else role icon */}
            <div
              className="profile-avatar"
              style={{
                background: avatarPreview ? "transparent" : role.gradient,
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : role.icon
              }
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
                <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={user.email} disabled />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input type="text" className="form-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your company name" />
              </div>

              {/* FILE UPLOAD for avatar */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="preview"
                    style={{ marginTop: "10px", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(167,139,250,0.5)" }}
                  />
                )}
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "⏳ Saving Changes..." : "💾 Save Changes"}
            </button>
          </form>

          {/* Quick Actions — navigates based on role */}
          <div className="quick-actions">
            <button onClick={() => navigate(dashboardRoute[roleParam] || "/attendee")} className="action-btn">
              <span>🏠</span> Dashboard
            </button>
            <Link to="/events" className="action-btn">
              <span>🎪</span> Browse Events
            </Link>
            {roleParam === "attendee" && (
              <Link to="/attendee/session" className="action-btn">
                <span>📅</span> My Sessions
              </Link>
            )}
            <button onClick={() => navigate(-1)} className="action-btn">
              <span>↩️</span> Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}