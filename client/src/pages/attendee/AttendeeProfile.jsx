import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AttendeeProfile.css";

export default function AttendeeProfile() {
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const name    = user?.name    || "Attendee Name";
  const email   = user?.email   || "attendee@email.com";
  const phone   = user?.phone   || "Not provided";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="profile-wrapper">
      <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div className="avatar-box">{initial}</div>

        <div className="info">
          <div className="name">{name}</div>
          <div className="role">Event Attendee</div>

          <div className="row"><User size={18} />{name}</div>
          <div className="row"><Mail size={18} />{email}</div>
          <div className="row"><Phone size={18} />{phone}</div>
          <div className="row"><MapPin size={18} />Karachi, Pakistan</div>

          <button className="edit-btn" onClick={() => navigate("/profilepage?role=attendee")}>
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

      </motion.div>
    </div>
  );
}