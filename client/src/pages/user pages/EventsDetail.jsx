import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./EventsDetail.css";
import ErrorPage from "../ErrorPage";
import UpdateEventModal from "../../components/events/UpdateEventModal";
import { eventAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";

const STATIC_EVENTS = [
  { _id: "1",  title: "AI & Robotics Summit 2026",         description: "Explore the future of artificial intelligence and robotics with industry leaders and innovators from around the globe.",          location: "Dubai, UAE",            startDate: "2026-08-15", endDate: "2026-08-17", category: "Technology", status: "upcoming",  coverImage: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg", maxAttendees: 5000,  registeredAttendees: 3240,  ticketPrice: 299, tags: ["AI","Robotics","Innovation","Tech"]                    },
  { _id: "2",  title: "Global Fashion Week",                description: "Witness the latest fashion trends, designer collections, and runway shows from top fashion houses worldwide.",                    location: "Paris, France",         startDate: "2026-09-20", endDate: "2026-09-25", category: "Fashion",    status: "upcoming",  coverImage: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg", maxAttendees: 3000,  registeredAttendees: 2890,  ticketPrice: 450, tags: ["Fashion","Design","Runway","Style"]                    },
  { _id: "3",  title: "World Food Festival",                description: "A culinary journey featuring world-class chefs, food tastings, cooking demonstrations, and gastronomic excellence.",              location: "Tokyo, Japan",          startDate: "2026-07-10", endDate: "2026-07-12", category: "Food",       status: "ongoing",   coverImage: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", maxAttendees: 4500,  registeredAttendees: 4200,  ticketPrice: 180, tags: ["Food","Culinary","Chefs","Gastronomy"]                 },
  { _id: "4",  title: "Contemporary Art Event",             description: "Discover groundbreaking contemporary art from emerging and established artists across various mediums and styles.",                location: "New York, USA",         startDate: "2026-10-05", endDate: "2026-10-08", category: "Art",        status: "upcoming",  coverImage: "https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg", maxAttendees: 2500,  registeredAttendees: 1850,  ticketPrice: 120, tags: ["Art","Gallery","Contemporary","Exhibition"]            },
  { _id: "5",  title: "Global Business Summit",             description: "Connect with business leaders, investors, and entrepreneurs to discuss market trends, innovations, and opportunities.",            location: "Singapore",             startDate: "2026-06-15", endDate: "2026-06-18", category: "Business",  status: "completed", coverImage: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", maxAttendees: 6000,  registeredAttendees: 5800,  ticketPrice: 599, tags: ["Business","Networking","Investment","Leadership"]      },
  { _id: "6",  title: "Science & Innovation Event",         description: "Showcasing cutting-edge scientific research, breakthrough discoveries, and innovative technologies shaping our future.",          location: "London, UK",            startDate: "2026-11-22", endDate: "2026-11-24", category: "Science",   status: "upcoming",  coverImage: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg", maxAttendees: 4000,  registeredAttendees: 2650,  ticketPrice: 250, tags: ["Science","Research","Innovation","Discovery"]          },
  { _id: "7",  title: "Tech Startup Conference",            description: "Meet innovative startups, pitch to investors, and explore emerging technologies disrupting traditional industries.",               location: "San Francisco, USA",    startDate: "2026-08-28", endDate: "2026-08-30", category: "Technology", status: "upcoming",  coverImage: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg", maxAttendees: 3500,  registeredAttendees: 3100,  ticketPrice: 350, tags: ["Startups","Tech","Innovation","Venture Capital"]       },
  { _id: "8",  title: "Sustainable Living Fair",            description: "Learn about eco-friendly products, renewable energy, sustainable practices, and green innovations for a better planet.",          location: "Copenhagen, Denmark",   startDate: "2026-09-10", endDate: "2026-09-12", category: "Other",     status: "upcoming",  coverImage: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg", maxAttendees: 2800,  registeredAttendees: 2200,  ticketPrice: 95,  tags: ["Sustainability","Green","Eco","Environment"]           },
  { _id: "9",  title: "Digital Marketing Summit",           description: "Master the latest digital marketing strategies, SEO techniques, social media trends, and growth hacking methods.",                location: "Mumbai, India",         startDate: "2026-07-25", endDate: "2026-07-27", category: "Business",  status: "ongoing",   coverImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", maxAttendees: 5500,  registeredAttendees: 5200,  ticketPrice: 199, tags: ["Marketing","Digital","SEO","Growth"]                   },
  { _id: "10", title: "Gaming & Esports Event",             description: "Experience the latest gaming titles, meet professional esports players, and discover gaming hardware and innovations.",           location: "Seoul, South Korea",    startDate: "2026-12-08", endDate: "2026-12-10", category: "Technology", status: "upcoming",  coverImage: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg", maxAttendees: 8000,  registeredAttendees: 6800,  ticketPrice: 149, tags: ["Gaming","Esports","Technology","Entertainment"]        },
  { _id: "11", title: "Luxury Fashion Summit",              description: "Exclusive showcase of haute couture, luxury brands, and high-end fashion innovations from around the world.",                    location: "Milan, Italy",          startDate: "2026-10-12", endDate: "2026-10-15", category: "Fashion",   status: "upcoming",  coverImage: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg", maxAttendees: 1800,  registeredAttendees: 1420,  ticketPrice: 750, tags: ["Luxury","Couture","HighFashion","Designer"]            },
  { _id: "12", title: "International Street Food Festival", description: "Taste authentic street food from 50+ countries with live cooking shows and culinary competitions.",                               location: "Bangkok, Thailand",     startDate: "2026-08-05", endDate: "2026-08-07", category: "Food",      status: "upcoming",  coverImage: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",   maxAttendees: 12000, registeredAttendees: 10800, ticketPrice: 89,  tags: ["StreetFood","Culinary","Festival","Global"]            },
  { _id: "13", title: "Modern Art & Design Fair",           description: "Celebrate contemporary art, design, and architecture with immersive installations and artist talks.",                            location: "Berlin, Germany",       startDate: "2026-09-18", endDate: "2026-09-21", category: "Art",       status: "upcoming",  coverImage: "https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg", maxAttendees: 3200,  registeredAttendees: 2780,  ticketPrice: 220, tags: ["ModernArt","Design","Architecture","Installation"]     },
  { _id: "14", title: "Quantum Computing Conference",       description: "Explore quantum algorithms, hardware breakthroughs, and practical applications of quantum technology.",                          location: "Boston, USA",           startDate: "2026-11-10", endDate: "2026-11-12", category: "Science",   status: "upcoming",  coverImage: "https://images.pexels.com/photos/3559483/pexels-photo-3559483.jpeg", maxAttendees: 2200,  registeredAttendees: 1980,  ticketPrice: 650, tags: ["Quantum","Computing","Science","Research"]             },
  { _id: "15", title: "Sustainable Fashion Event",          description: "Showcasing eco-friendly fashion, circular economy, and ethical production practices for the future.",                           location: "Amsterdam, Netherlands", startDate: "2026-07-30", endDate: "2026-08-01", category: "Fashion",   status: "upcoming",  coverImage: "https://images.pexels.com/photos/1461260/pexels-photo-1461260.jpeg", maxAttendees: 2600,  registeredAttendees: 2340,  ticketPrice: 175, tags: ["Sustainable","EcoFashion","Ethical","Circular"]        },
  { _id: "16", title: "HealthTech & Biotech Summit",        description: "Revolutionary healthcare technologies, medical AI, biotech innovations, and digital health solutions.",                         location: "Zurich, Switzerland",   startDate: "2026-09-28", endDate: "2026-09-30", category: "Technology", status: "upcoming",  coverImage: "https://images.pexels.com/photos/4164872/pexels-photo-4164872.jpeg", maxAttendees: 4500,  registeredAttendees: 4120,  ticketPrice: 525, tags: ["HealthTech","Biotech","MedicalAI","Healthcare"]        },
  { _id: "17", title: "Creative Directors Forum",           description: "Where top creative directors share strategies for brand storytelling, visual identity, and innovation.",                        location: "Los Angeles, USA",      startDate: "2026-06-22", endDate: "2026-06-24", category: "Business",  status: "ongoing",   coverImage: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", maxAttendees: 1500,  registeredAttendees: 1480,  ticketPrice: 799, tags: ["Creative","Branding","Design","Leadership"]            },
  { _id: "18", title: "Space Tech & Aerospace Events",      description: "Latest in space exploration, satellite technology, aerospace engineering, and commercial spaceflight.",                        location: "Cape Canaveral, USA",   startDate: "2026-12-15", endDate: "2026-12-17", category: "Science",   status: "upcoming",  coverImage: "https://images.pexels.com/photos/1166751/pexels-photo-1166751.jpeg", maxAttendees: 6800,  registeredAttendees: 5920,  ticketPrice: 425, tags: ["Space","Aerospace","Satellite","Exploration"]          },
];

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
  ongoing:   { label: "Live Now", color: "#34d399", bg: "rgba(52,211,153,0.15)"  },
  completed: { label: "Ended",    color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
};

export default function EventsDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [activeTab,       setActiveTab]       = useState("overview");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [events,          setEvents]          = useState(null);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    eventAPI.getById(id)
      .then(({ event }) => setEvents(event))
      .catch(() => {
        const found = STATIC_EVENTS.find((e) => e._id === id);
        setEvents(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return null;
  if (!events)  return <ErrorPage />;

  const statusConfig         = STATUS_CONFIG[events.status] || STATUS_CONFIG.upcoming;
  const attendancePercentage = Math.min(100, ((events.registeredAttendees / events.maxAttendees) * 100)).toFixed(0);

  // Only admins see Edit/Delete — not attendees, not exhibitors
  const isAdmin = user?.role === "admin";

  return (
    <>
      <div className="ed-root">
        <div className="ed-mesh" />
        <div className="ed-inner">

          {/* TOP BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <button
              onClick={() => {
                const fromAdmin = window.location.pathname.includes("/admin");
                navigate(fromAdmin ? "/admin/adminEvents" : "/events");
              }}
              className="back-btn"
            >
              ← Back to Events
            </button>

            {/* Admin-only actions */}
            {isAdmin && (
              <div className="ed-admin-actions">
                <button className="ed-admin-btn ed-admin-update" onClick={() => setShowUpdateModal(true)} title="Update Event">
                  ✏️ Edit
                </button>
                <button
                  className="ed-admin-btn ed-admin-delete"
                  onClick={() => {
                    if (confirm(`🗑️ Delete "${events.title}"?\n\nThis expo will be permanently deleted.`)) {
                      eventAPI.delete(id)
                        .then(() => navigate("/admin/adminEvents"))
                        .catch((err) => alert("Delete failed: " + err.message));
                    }
                  }}
                  title="Delete Event"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* HERO BANNER */}
          <div className="ed-hero">
            <img src={events.coverImage} alt={events.title} className="ed-hero-img" />
            <div className="ed-hero-overlay"></div>
            <div className="ed-hero-content">
              <div className="ed-hero-badges">
                <span className="ed-badge" style={{ background: statusConfig.bg, color: statusConfig.color, borderColor: statusConfig.color }}>
                  {statusConfig.label}
                </span>
                <span className="ed-badge" style={{ background: "rgba(108,109,145,0.3)", color: "#f5d5e0" }}>
                  {events.category}
                </span>
              </div>
              <h1 className="ed-hero-title">{events.title}</h1>
              <div className="ed-hero-meta">
                <div className="ed-meta-item"><span>📍</span><span>{events.location}</span></div>
                <div className="ed-meta-item">
                  <span>📅</span>
                  <span>
                    {new Date(events.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" - "}
                    {new Date(events.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="ed-meta-item"><span>👥</span><span>{(events.registeredAttendees || 0).toLocaleString()} attending</span></div>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="ed-content-grid">
            <div>
              <div className="ed-tabs">
                <button className={`ed-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
                <button className={`ed-tab ${activeTab === "details"  ? "active" : ""}`} onClick={() => setActiveTab("details") }>Details</button>
                <button className={`ed-tab ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>Schedule</button>
              </div>

              <div className="ed-tab-content">
                {activeTab === "overview" && (
                  <>
                    <h2 className="ed-section-title">About This Event</h2>
                    <p className="ed-description">{events.description}</p>
                    <p className="ed-description">
                      Join us for an unforgettable experience at {events.title}, taking place in {events.location}. This premier event brings together industry leaders, innovators, and enthusiasts from around the world.
                    </p>
                    <p className="ed-description">
                      Whether you're looking to network, learn about the latest trends, or showcase your innovations, this event offers something for everyone.
                    </p>
                    {events.tags?.length > 0 && (
                      <>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginTop: "32px", marginBottom: "16px", color: "var(--ed-text)" }}>Event Tags</h3>
                        <div className="ed-tags">
                          {events.tags.map((tag, i) => <span key={i} className="ed-tag">#{tag}</span>)}
                        </div>
                      </>
                    )}
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    <h2 className="ed-section-title">Event Details</h2>
                    <div style={{ display: "grid", gap: "20px" }}>
                      {[
                        { label: "Location", value: events.location },
                        { label: "Duration", value: `${new Date(events.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} - ${new Date(events.endDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}` },
                        { label: "Category", value: events.category },
                        { label: "Capacity", value: `${(events.maxAttendees || 0).toLocaleString()} attendees maximum` },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <h4 style={{ fontSize: "14px", color: "var(--ed-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</h4>
                          <p style={{ fontSize: "16px", color: "var(--ed-text)", fontWeight: 600 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "schedule" && (
                  <>
                    <h2 className="ed-section-title">Event Schedule</h2>
                    <p className="ed-description">Detailed schedule information will be available closer to the event date.</p>
                    <div style={{ marginTop: "24px", padding: "24px", background: "var(--ed-surface)", borderRadius: "16px", border: "1px solid var(--ed-border)" }}>
                      <p style={{ fontSize: "14px", color: "var(--ed-sub)", textAlign: "center" }}>📅 Full schedule coming soon</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="ed-sidebar">
              <div className="ed-sidebar-card" style={{ position: "relative" }}>
                <div className="ed-price-tag">{events.ticketPrice === 0 ? "FREE" : `$${events.ticketPrice}`}</div>
                <div className="ed-price-label">Per ticket</div>

                {/* Register Now only for attendees or non-logged-in users */}
                {user?.role !== "admin" && user?.role !== "exhibitor" && (
                  <button className="ed-register-btn" onClick={() => navigate(user ? "/attendee/booking" : "/login")}>
                    {user?.role === "attendee" ? "Book Now" : "Register Now"}
                  </button>
                )}

                <div>
                  <div className="ed-stat-row"><span className="ed-stat-label"><span>👥</span>Attendees</span><span className="ed-stat-value">{(events.registeredAttendees || 0).toLocaleString()}</span></div>
                  <div className="ed-stat-row"><span className="ed-stat-label"><span>🎟️</span>Available Spots</span><span className="ed-stat-value">{((events.maxAttendees || 0) - (events.registeredAttendees || 0)).toLocaleString()}</span></div>
                  <div className="ed-stat-row"><span className="ed-stat-label"><span>📍</span>Location</span><span className="ed-stat-value">{events.location}</span></div>
                </div>

                <div className="ed-progress-bar"><div className="ed-progress-fill" style={{ width: `${attendancePercentage}%` }}></div></div>
                <div className="ed-progress-text">{attendancePercentage}% filled • {(events.maxAttendees || 0) - (events.registeredAttendees || 0)} spots remaining</div>
              </div>

              <div className="ed-sidebar-card" style={{ position: "relative" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", color: "var(--ed-text)" }}>Share Event</h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["📱", "🔗", "✉️"].map((icon) => (
                    <button key={icon} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid var(--ed-border)", background: "var(--ed-surface)", color: "var(--ed-text)", cursor: "pointer", fontSize: "24px" }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateEventModal expo={events} open={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </>
  );
}