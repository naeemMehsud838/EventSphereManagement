import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./contact.css";
import { contactAPI } from "../../api";

export default function Contact() {
  const [openFaq,    setOpenFaq]    = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);
  const [sent,       setSent]       = useState(false);

  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const faqs = [
    { q: "How fast do you respond?",      a: "We usually respond within 24 hours for all inquiries."        },
    { q: "Can I manage multiple events?", a: "Yes, EventSphere supports unlimited event management."         },
    { q: "Is my data secure?",            a: "Yes, all data is encrypted and fully protected."               },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      setForm({ name: "", email: "", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 2500);
    } catch (err) {
      alert(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">

      {/* GLOW */}
      <div className="contact-glow"></div>

      {/* HERO */}
      <div className="contact-header">
        <h1>Contact <span>EventSphere</span></h1>
        <p>Let's build world-class event experiences together.</p>
      </div>

      {/* HERO IMAGE */}
      <div className="contact-hero-img">
        <img src="src/assets/contact-img.jpeg" alt="event" />
      </div>

      {/* MAIN GRID */}
      <div className="contact-grid">

        {/* FORM */}
        <form className="lux-form" onSubmit={handleSubmit}>
          <h2>Send Message</h2>

          <div className="field">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <label>Name</label>
          </div>

          <div className="field">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            <label>Email</label>
          </div>

          <div className="field">
            <textarea
              rows="4"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              disabled={loading}
            ></textarea>
            <label>Message</label>
          </div>

          <button type="submit" disabled={loading}>
            {sent ? "Sent ✔" : loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* INFO */}
        <div className="info-box">
          <h2>Contact Info</h2>
          <p>📍 Karachi, Pakistan</p>
          <p>📧 support@eventsphere.com</p>
          <p>📞 +92 300 0000000</p>
          <div className="mini-box">We respond within 24 hours</div>
        </div>

      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((item, i) => (
          <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
            <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {item.q}
              <span>{openFaq === i ? "−" : "+"}</span>
            </div>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  className="faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* PRIVACY & TERMS */}
      <div className="policy-section">
        <h2 className="section-title">Legal Information</h2>
        {[
          { key: "terms",   title: "📜 Terms & Conditions", text: "By using EventSphere, you agree to follow platform rules. Misuse may lead to account suspension." },
          { key: "privacy", title: "🔒 Privacy Policy",     text: "We protect your data with encryption and never share it with third parties."                       },
        ].map((p) => (
          <div key={p.key} className={`policy-card ${openPolicy === p.key ? "open" : ""}`}>
            <div className="policy-header" onClick={() => setOpenPolicy(openPolicy === p.key ? null : p.key)}>
              <h3>{p.title}</h3>
              <span>{openPolicy === p.key ? "−" : "+"}</span>
            </div>
            <motion.div
              className="policy-text"
              initial={false}
              animate={openPolicy === p.key ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="policy-inner">{p.text}</div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {sent && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-modal"
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30 }}
            >
              <div className="check">✔</div>
              <h2>Message Sent!</h2>
              <p>We'll contact you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}