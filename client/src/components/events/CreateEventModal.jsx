import { useEffect, useState } from "react";
import "./CreateEventModal.css";
import { eventAPI } from "../../api";
import toast from "react-hot-toast";

function CreateEventModal({ open, onClose, onCreated }) {
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

  useEffect(() => {
    if (open) {
      setForm({ title: "", category: "", location: "", ticketPrice: "", startDate: "", endDate: "", description: "" });
      setImageFile(null);
      setPreview("");
    }
  }, [open]);

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
    setLoading(true);
    try {
      // Build FormData so multer can receive the file
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("coverImage", imageFile);

      await eventAPI.create(fd);
      toast.success("Event created successfully! 🎉", { duration: 4000 });
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to create event", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="cem-overlay" onClick={onClose}>
        <div className="cem-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cem-header">
            <h2 className="cem-title">Create <span>New Event</span></h2>
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

              {/* FILE UPLOAD instead of URL */}
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
                {loading ? "Saving..." : "Save Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEventModal;