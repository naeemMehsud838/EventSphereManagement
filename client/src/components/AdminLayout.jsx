import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, CalendarPlus, Users, Ticket,
  CalendarDays, MessageCircle, CreditCard, User, LogOut, Menu, X,
} from "lucide-react";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) => (isActive ? "link active" : "link");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = (
    <>
      <NavLink to="/admin" end className={linkClass}><LayoutDashboard size={18} /> Dashboard</NavLink>
      <NavLink to="/admin/adminEvents" className={linkClass}><CalendarPlus size={18} /> Events</NavLink>
      <NavLink to="/admin/adminExhibitors" className={linkClass}><Users size={18} /> Exhibitors</NavLink>
      <NavLink to="/admin/adminAttendees" className={linkClass}><Users size={18} /> Attendees</NavLink>
      <NavLink to="/admin/adminMessages" className={linkClass}><MessageCircle size={18} /> Messages</NavLink>
      <NavLink to="/admin/adminPayments" className={linkClass}><CreditCard size={18} /> Payments</NavLink>
      <NavLink to="/admin/adminSchedule" className={linkClass}><CalendarDays size={18} /> Schedule</NavLink>
      <NavLink to="/admin/adminTickets" className={linkClass}><Ticket size={18} /> Tickets</NavLink>
      <NavLink to="/admin/adminProfile" className={linkClass}><User size={18} /> Profile</NavLink>
      <button className="link" onClick={handleLogout}><LogOut size={18} /> Logout</button>
    </>
  );

  return (
    <>
      <style>{`
        .admin-wrapper{display:flex;height:100vh;background:var(--darkest);color:var(--accent);overflow:hidden;}
        .sidebar{width:260px;height:100vh;background:var(--secondary);border-right:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;padding:20px;overflow-y:auto;}
        .sidebar::-webkit-scrollbar,.mobile::-webkit-scrollbar{width:6px;}
        .sidebar::-webkit-scrollbar-thumb,.mobile::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:10px;}
        .top{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:700;margin-bottom:25px;flex-shrink:0;}
        .logo-box{width:38px;height:38px;border-radius:12px;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--accent);}
        .nav{display:flex;flex-direction:column;gap:10px;flex:1;min-height:max-content;}
        .link{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;text-decoration:none;color:var(--secondary);transition:0.3s;border:none;background:none;cursor:pointer;font-size:15px;width:100%;}
        .link:hover{background:var(--secondary);transform:translateX(4px);}
        .link.active{background:var(--secondary);color:white;}
        .main-area{flex:1;display:flex;flex-direction:column;min-width:0;height:100vh;}
        .topbar{height:65px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:var(--secondary);border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
        .menu-btn{display:none;cursor:pointer;}
        .content{flex:1;overflow-y:auto;padding:20px;}
        @media(max-width:768px){.sidebar{display:none;}.menu-btn{display:block;}}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:900;backdrop-filter:blur(3px);}
        .mobile{position:fixed;top:0;left:0;width:260px;height:100vh;background:var(--darkest);padding:20px;z-index:1000;display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,0.08);box-shadow:5px 0 20px rgba(0,0,0,0.4);overflow-y:auto;}
        .mobile-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;flex-shrink:0;}
        .close-btn{background:none;border:none;color:var(--accent);cursor:pointer;}
        .mobile-links{display:flex;flex-direction:column;gap:10px;}
      `}</style>

      <div className="admin-wrapper">
        <motion.aside className="sidebar" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="top"><div className="logo-box">ES</div>EventSphere</div>
          <div className="nav">{navLinks}</div>
        </motion.aside>

        <div className="main-area">
          <div className="topbar">
            <Menu className="menu-btn" onClick={() => setMobileOpen(true)} />
            <h3>Admin Panel</h3>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>{user?.name || "Admin"}</div>
          </div>
          <div className="content"><Outlet /></div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile} />
              <motion.aside className="mobile" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}>
                <div className="mobile-top">
                  <div className="top"><div className="logo-box">ES</div>EventSphere</div>
                  <button className="close-btn" onClick={closeMobile}><X /></button>
                </div>
                <div className="mobile-links" onClick={closeMobile}>{navLinks}</div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}