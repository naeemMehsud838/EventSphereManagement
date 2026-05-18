import { useEffect, useState } from "react";
import "./CreateEventModal.css";
import { eventAPI } from "../../api";
import toast from "react-hot-toast";

function UpdateEventModal({ open, onClose, expo }) {
  const [form, setForm] = useState({
    title: "", category: "", location: "", ticketPrice: "",
    startDate: "", endDate: "", description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState("");
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // Pre-fill with existing event data
  useEffect(() => {
    if (open && expo) {
      setForm({
        title:       expo.title       || "",
        category:    expo.category    || "",
        location:    expo.location    || "",
        ticketPrice: expo.ticketPrice || "",
        startDate:   expo.startDate   ? expo.startDate.split("T")[0] : "",
        endDate:     expo.endDate     ? expo.endDate.split("T")[0]   : "",
        description: expo.description || "",
      });
      setPreview(expo.coverImage || "");
      setImageFile(null);
    }
  }, [open, expo]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Static events — keep original alert behaviour
    const staticIds = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"];
    if (!expo?._id || staticIds.includes(expo._id)) {
      alert("Event has been Updated successfully! 🎉");
      onClose();
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("coverImage", imageFile);

      await eventAPI.update(expo._id, fd);
      toast.success("Event updated successfully! 🎉", { duration: 4000 });
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update event", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="cem-overlay" onClick={onClose}>
        <div className="cem-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cem-header">
            <h2 className="cem-title">Update <span>Event</span></h2>
            <button className="cem-close" onClick={onClose}>✕</button>
          </div>

          <form className="cem-body" onSubmit={handleSubmit}>
            <div className="cem-grid">

              <div className="cem-field">
                <label className="cem-label">Event Title</label>
                <input className="cem-input" type="text" name="title" placeholder="Enter event title" value={form.title} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="cem-field">
                <label className="cem-label">Category</label>
                <select className="cem-select" name="category" value={form.category} onChange={handleChange} required disabled={loading}>
                  <option value="">Select category</option>
                  <option>Technology</option>
                  <option>Fashion</option>
                  <option>Food</option>
                  <option>Art</option>
                  <option>Business</option>
                  <option>Science</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="cem-field">
                <label className="cem-label">Location</label>
                <input className="cem-input" type="text" name="location" placeholder="Event location" value={form.location} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="cem-field">
                <label className="cem-label">Ticket Price</label>
                <input className="cem-input" type="number" name="ticketPrice" placeholder="199" step="0.01" value={form.ticketPrice} onChange={handleChange} required disabled={loading} />
              </div>

              {/* FILE UPLOAD */}
              <div className="cem-field full">
                <label className="cem-label">Event Image</label>
                <input
                  className="cem-input cem-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    style={{ marginTop: "10px", width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "10px" }}
                  />
                )}
              </div>

              <div className="cem-field">
                <label className="cem-label">Start Date</label>
                <input className="cem-input" type="date" name="startDate" value={form.startDate} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="cem-field">
                <label className="cem-label">End Date</label>
                <input className="cem-input" type="date" name="endDate" value={form.endDate} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="cem-field full">
                <label className="cem-label">Description</label>
                <textarea className="cem-textarea" name="description" placeholder="Describe your event..." value={form.description} onChange={handleChange} required disabled={loading} />
              </div>

            </div>

            <div className="cem-actions">
              <button type="button" className="cem-btn cancel" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="cem-btn save" disabled={loading}>
                {loading ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateEventModal;