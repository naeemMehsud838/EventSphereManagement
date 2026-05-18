import { useState } from "react";
import toast from "react-hot-toast";
import { boothAPI } from "../../api";
import "./CreateBooth.css";

export default function CreateBooth() {
  const [form, setForm] = useState({
    name: "", category: "Technology", description: "", location: "", contactEmail: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await boothAPI.create(form);
      toast.success("Booth created! Pending admin approval.", { duration: 4000 });
      setForm({ name: "", category: "Technology", description: "", location: "", contactEmail: "" });
    } catch (err) {
      toast.error(err.message || "Failed to create booth.", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-booth">
      <div className="booth-header">
        <h1>🚀 Create <span>Booth</span></h1>
        <p>Build your premium exhibitor booth and showcase it in the EventSphere expo system.</p>
      </div>

      <div className="booth-grid">
        <div className="premium-card">
          <h2 className="form-title">Booth Details</h2>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Booth Name</label>
              <input type="text" name="name" placeholder="Enter booth name" value={form.name} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} disabled={loading}>
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Healthcare</option>
                <option>Environment</option>
              </select>
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea name="description" placeholder="Describe your booth..." value={form.description} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" placeholder="Hall A" value={form.location} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" placeholder="example@mail.com" value={form.contactEmail} onChange={handleChange} disabled={loading} />
            </div>
            <button className="create-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "🚀 Create Booth"}
            </button>
          </form>
        </div>

        <div className="premium-card preview-card">
          <div className="preview-banner">
            <span className="preview-badge">Live Preview</span>
          </div>
          <h3 className="preview-title">Your Booth Preview</h3>
          <p className="preview-desc">This preview updates how your booth will appear in the expo system.</p>
          <div className="preview-info">
            <div className="preview-box"><h4>Category</h4><p>{form.category || "Technology"}</p></div>
            <div className="preview-box"><h4>Location</h4><p>{form.location || "Hall A"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}