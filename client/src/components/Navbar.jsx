// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/events",  label: "Events",  icon: "◈" },
  { to: "/pricing", label: "Pricing", icon: "✧" },
  { to: "/about",   label: "About",   icon: "◎" },
  { to: "/contact", label: "Contact", icon: "⬟" },
];

// Where each role's dashboard lives
const DASHBOARD_ROUTES = {
  admin:     "/admin",
  exhibitor: "/exhibitor",
  attendee:  "/attendee",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const drawerRef = useRef(null);

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("es-theme") || "dark"
  );

  /* ── Scroll handler ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      if (scrollY > 20) {
        document.body.classList.add("navbar-scrolled");
        document.documentElement.style.scrollPaddingTop = "64px";
      } else {
        document.body.classList.remove("navbar-scrolled");
        document.documentElement.style.scrollPaddingTop = "72px";
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("navbar-scrolled");
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, []);

  /* ── Theme ── */
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  /* ── Close on route change ── */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    if (menuOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, profileOpen]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const dark = theme === "dark";

  /* ── Logout ── */
  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/login");
  };

  /* ── Profile dropdown items based on role ── */
  const profileMenuItems = user
    ? [
        {
          icon: "🏠",
          label: "My Dashboard",
          onClick: () => { navigate(DASHBOARD_ROUTES[user.role]); setProfileOpen(false); },
        },
        {
          icon: "👤",
          label: "My Profile",
          onClick: () => { navigate(`/profilepage?role=${user.role}`); setProfileOpen(false); },
        },
        {
          icon: "🚪",
          label: "Logout",
          onClick: handleLogout,
          danger: true,
        },
      ]
    : [];

  /* ── Avatar initials ── */
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav className={`nb-root ${scrolled ? "nb-scrolled" : "nb-top"}`} ref={drawerRef}>
      <div className="nb-wrap">
        {/* ── MAIN BAR ── */}
        <div className="nb-bar">

          {/* LOGO */}
          <Link to="/" className="nb-logo">
            <div className="nb-orb">
              <span className="nb-orb-label">ES</span>
            </div>
            <span className="nb-brand">Event<em>Sphere</em></span>
          </Link>

          {/* DESKTOP CENTER LINKS */}
          <div className="nb-center nb-desktop">
            {NAV_LINKS.map((link, index) => (
              <div key={link.to} style={{ display: "flex", alignItems: "center" }}>
                {index > 0 && <div className="nb-sep" />}
                <Link
                  to={link.to}
                  className={`nb-link ${location.pathname === link.to ? "active" : ""}`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="nb-right nb-desktop">
            <button className="nb-theme" onClick={toggleTheme} title="Toggle Theme">
              {dark ? "☀️" : "🌙"}
            </button>

            {/* ── NOT LOGGED IN ── */}
            {!user && (
              <>
                <Link to="/login"    className="nb-signin">Sign in</Link>
                <Link to="/register" className="nb-cta">Get Started →</Link>
              </>
            )}

            {/* ── LOGGED IN ── */}
            {user && (
              <div className="nb-profile-container">
                <button
                  className="nb-profile-btn"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-label="Profile Menu"
                >
                  {/* Avatar circle with initials */}
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>
                    {initials}
                  </span>
                  <span className="nb-profile-name">{user.name.split(" ")[0]}</span>
                  <span className="nb-profile-arrow">▼</span>
                </button>

                <div className={`nb-profile-dropdown ${profileOpen ? "open" : ""}`}>
                  {/* User info header */}
                  <div style={{
                    padding: "12px 16px 10px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: "4px",
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--nb-text, #f1f5f9)" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "2px", textTransform: "capitalize" }}>
                      {user.role}
                    </div>
                  </div>

                  {profileMenuItems.map((item) => (
                    <div
                      key={item.label}
                      className="nb-profile-item"
                      onClick={item.onClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { item.onClick(); e.preventDefault(); } }}
                      style={item.danger ? { color: "#f87171" } : {}}
                    >
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE RIGHT */}
          <div className="nb-right nb-mobile-only" style={{ gap: 8 }}>
            <button className="nb-theme" onClick={toggleTheme} title="Toggle Theme">
              {dark ? "☀️" : "🌙"}
            </button>
            <button
              className={`nb-ham ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle Menu"
            >
              <div className="nb-ham-line" />
              <div className="nb-ham-line" />
              <div className="nb-ham-line" />
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div className={`nb-drawer ${menuOpen ? "open" : ""}`}>
          <div className="nb-drawer-inner">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nb-mob-link ${location.pathname === link.to ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb-mob-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            <div className="nb-mob-actions">
              {/* Not logged in */}
              {!user && (
                <>
                  <Link to="/login"    className="nb-signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link to="/register" className="nb-cta"    onClick={() => setMenuOpen(false)}>Get Started →</Link>
                </>
              )}

              {/* Logged in */}
              {user && (
                <div className="nb-mob-profile">
                  <div style={{ padding: "10px 0 6px", fontSize: "13px", fontWeight: 600, opacity: 0.7 }}>
                    {user.name} · <span style={{ textTransform: "capitalize" }}>{user.role}</span>
                  </div>
                  <div
                    className="nb-profile-item"
                    onClick={() => { navigate(DASHBOARD_ROUTES[user.role]); setMenuOpen(false); }}
                    role="button" tabIndex={0}
                  >
                    🏠 My Dashboard
                  </div>
                  <div
                    className="nb-profile-item"
                    onClick={() => { navigate(`/profilepage?role=${user.role}`); setMenuOpen(false); }}
                    role="button" tabIndex={0}
                  >
                    👤 My Profile
                  </div>
                  <div
                    className="nb-profile-item"
                    onClick={handleLogout}
                    role="button" tabIndex={0}
                    style={{ color: "#f87171" }}
                  >
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}