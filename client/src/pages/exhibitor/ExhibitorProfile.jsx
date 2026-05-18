import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, MapPin, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ExhibitorProfile.css";

export default function ExhibitorProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name    = user?.name    || "Exhibitor Name";
  const email   = user?.email   || "exhibitor@email.com";
  const phone   = user?.phone   || "Not provided";
  const company = user?.company || "Your Company";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="profile-wrapper">
      <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div className="avatar-box">{initial}</div>

        <div className="info">
          <div className="name">{name}</div>
          <div className="role">Event Exhibitor</div>

          <div className="row"><User size={18} />{name}</div>
          <div className="row"><Mail size={18} />{email}</div>
          <div className="row"><Phone size={18} />{phone}</div>
          <div className="row"><Building2 size={18} />{company}</div>
          <div className="row"><MapPin size={18} />Karachi, Pakistan</div>

          <button className="edit-btn" onClick={() => navigate("/profilepage?role=exhibitor")}>
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

      </motion.div>
    </div>
  );
}