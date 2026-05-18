import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminProfile.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name    = user?.name    || "Admin";
  const email   = user?.email   || "admin@eventsphere.com";
  const phone   = user?.phone   || "Not provided";
  const company = user?.company || "EventSphere";

  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="adminProfileWrapper">
      <div className="adminProfileCard">

        <div className="adminProfileTop">
          <div className="adminProfileAvatar">{initials}</div>
          <h1 className="adminProfileName">{name}</h1>
          <p className="adminProfileRole">Event Admin</p>
        </div>

        <div className="adminProfileInfoArea">
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Name</label>
            <p className="adminInfoValue">{name}</p>
          </div>
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Email</label>
            <p className="adminInfoValue">{email}</p>
          </div>
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Phone</label>
            <p className="adminInfoValue">{phone}</p>
          </div>
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Company</label>
            <p className="adminInfoValue">{company}</p>
          </div>
          <div className="adminInfoBox">
            <label className="adminInfoLabel">Location</label>
            <p className="adminInfoValue">Karachi, Pakistan</p>
          </div>
        </div>

        <button className="adminEditButton" onClick={() => navigate("/profilepage?role=admin")}>
          ✏️ Edit Profile
        </button>

      </div>
    </div>
  );
};

export default AdminProfile;