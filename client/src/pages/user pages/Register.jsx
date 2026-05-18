// src/pages/user pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "attendee", company: "", phone: "",
  });

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form);

      // Server returns { pending: true } for attendees awaiting approval
      if (data?.pending) {
        setPending(true);
        return;
      }

      // Exhibitor — auto approved, go to dashboard
      if (data?.role === "exhibitor") return navigate("/exhibitor");
      navigate("/attendee");

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Pending approval screen ──────────────────────────────
  if (pending) {
    return (
      <div className="register-container">
        <div className="register-card-wrapper">
          <div className="register-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <h2 style={{ color: "#a78bfa", marginBottom: "12px" }}>Account Created!</h2>
            <p style={{ opacity: 0.7, marginBottom: "8px", lineHeight: 1.6 }}>
              Your account is <strong>pending admin approval</strong>.<br />
              You'll be able to log in once an admin approves your request.
            </p>
            <p style={{ opacity: 0.45, fontSize: "13px", marginBottom: "24px" }}>
              This usually takes a short while. Please check back soon.
            </p>
            <Link to="/login" className="submit-btn" style={{ display: "inline-block", textDecoration: "none", padding: "12px 32px" }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card-wrapper">

        <div className="register-header">
          <h2 className="register-title">Join EventSphere</h2>
          <p className="register-subtitle">Create your account &amp; start managing expos</p>
        </div>

        <div className="register-card">

          <div className="role-selector">
            {["attendee", "exhibitor"].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-btn ${form.role === r ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: r })}
                disabled={loading}
              >
                {r === "attendee" ? "👤 Attendee" : "🏪 Exhibitor"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="register-form">

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                color: "#fca5a5", padding: "10px 14px", borderRadius: "10px",
                fontSize: "13px", marginBottom: "8px",
              }}>
                {error}
              </div>
            )}

            <input name="name"     placeholder="Full Name"    value={form.name}     onChange={handleChange} required className="input-field" disabled={loading} />
            <input name="email"    type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="input-field" disabled={loading} />

            {form.role === "exhibitor" && (
              <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} className="input-field" disabled={loading} />
            )}

            <input name="phone"    placeholder="Phone Number" value={form.phone}    onChange={handleChange} className="input-field" disabled={loading} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} className="input-field" disabled={loading} />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">Sign In</Link>
        </p>

        <p style={{ textAlign: "center", fontSize: "11px", opacity: 0.35, marginTop: "8px" }}>
          Admin accounts are created by system administrators only.
        </p>

      </div>
    </div>
  );
}

export default Register;