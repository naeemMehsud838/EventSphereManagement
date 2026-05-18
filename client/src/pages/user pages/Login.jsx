// src/pages/user pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Redirect based on role
      if (user.role === "admin")     return navigate("/admin");
      if (user.role === "exhibitor") return navigate("/exhibitor");
      navigate("/attendee");

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">

          {/* HEADER */}
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {/* CARD */}
          <div className="login-card">
            <form onSubmit={handleSubmit} className="login-form">

              {/* ERROR MESSAGE */}
              {error && (
                <div style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#fca5a5",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}>
                  {error}
                </div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
                disabled={loading}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="input-field"
                disabled={loading}
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="login-footer">
              Don't have an account?{" "}
              <Link to="/register" className="login-link">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}