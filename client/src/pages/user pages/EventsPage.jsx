import { useState, useRef, useEffect } from "react";
import EventCard from "../../components/events/EventCard";
import CreateEventModal from "../../components/events/CreateEventModal";
import { eventAPI } from "../../api";
import "./EventsPage.css";
import { useAuth } from "../../context/AuthContext";

/* ─── STATIC FALLBACK DATA (shown when DB is empty) ─────────── */
const STATIC_EVENTS = [
  {
    _id: "1",
    title: "AI & Robotics Summit 2026",
    description:
      "Explore the future of artificial intelligence and robotics with industry leaders and innovators from around the globe.",
    location: "Dubai, UAE",
    startDate: "2026-08-15",
    endDate: "2026-08-17",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    maxAttendees: 5000,
    registeredAttendees: 3240,
    ticketPrice: 299,
    tags: ["AI", "Robotics", "Innovation", "Tech"],
  },
  {
    _id: "2",
    title: "Global Fashion Week",
    description:
      "Witness the latest fashion trends, designer collections, and runway shows from top fashion houses worldwide.",
    location: "Paris, France",
    startDate: "2026-09-20",
    endDate: "2026-09-25",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    maxAttendees: 3000,
    registeredAttendees: 2890,
    ticketPrice: 450,
    tags: ["Fashion", "Design", "Runway", "Style"],
  },
  {
    _id: "3",
    title: "World Food Festival",
    description:
      "A culinary journey featuring world-class chefs, food tastings, cooking demonstrations, and gastronomic excellence.",
    location: "Tokyo, Japan",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    category: "Food",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    maxAttendees: 4500,
    registeredAttendees: 4200,
    ticketPrice: 180,
    tags: ["Food", "Culinary", "Chefs", "Gastronomy"],
  },
  {
    _id: "4",
    title: "Contemporary Art Event",
    description:
      "Discover groundbreaking contemporary art from emerging and established artists across various mediums and styles.",
    location: "New York, USA",
    startDate: "2026-10-05",
    endDate: "2026-10-08",
    category: "Art",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg",
    maxAttendees: 2500,
    registeredAttendees: 1850,
    ticketPrice: 120,
    tags: ["Art", "Gallery", "Contemporary", "Exhibition"],
  },
  {
    _id: "5",
    title: "Global Business Summit",
    description:
      "Connect with business leaders, investors, and entrepreneurs to discuss market trends, innovations, and opportunities.",
    location: "Singapore",
    startDate: "2026-06-15",
    endDate: "2026-06-18",
    category: "Business",
    status: "completed",
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    maxAttendees: 6000,
    registeredAttendees: 5800,
    ticketPrice: 599,
    tags: ["Business", "Networking", "Investment", "Leadership"],
  },
  {
    _id: "6",
    title: "Science & Innovation Event",
    description:
      "Showcasing cutting-edge scientific research, breakthrough discoveries, and innovative technologies shaping our future.",
    location: "London, UK",
    startDate: "2026-11-22",
    endDate: "2026-11-24",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
    maxAttendees: 4000,
    registeredAttendees: 2650,
    ticketPrice: 250,
    tags: ["Science", "Research", "Innovation", "Discovery"],
  },
  {
    _id: "7",
    title: "Tech Startup Conference",
    description:
      "Meet innovative startups, pitch to investors, and explore emerging technologies disrupting traditional industries.",
    location: "San Francisco, USA",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    maxAttendees: 3500,
    registeredAttendees: 3100,
    ticketPrice: 350,
    tags: ["Startups", "Tech", "Innovation", "Venture Capital"],
  },
  {
    _id: "8",
    title: "Sustainable Living Fair",
    description:
      "Learn about eco-friendly products, renewable energy, sustainable practices, and green innovations for a better planet.",
    location: "Copenhagen, Denmark",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    category: "Other",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    maxAttendees: 2800,
    registeredAttendees: 2200,
    ticketPrice: 95,
    tags: ["Sustainability", "Green", "Eco", "Environment"],
  },
  {
    _id: "9",
    title: "Digital Marketing Summit",
    description:
      "Master the latest digital marketing strategies, SEO techniques, social media trends, and growth hacking methods.",
    location: "Mumbai, India",
    startDate: "2026-07-25",
    endDate: "2026-07-27",
    category: "Business",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    maxAttendees: 5500,
    registeredAttendees: 5200,
    ticketPrice: 199,
    tags: ["Marketing", "Digital", "SEO", "Growth"],
  },
  {
    _id: "10",
    title: "Gaming & Esports Event",
    description:
      "Experience the latest gaming titles, meet professional esports players, and discover gaming hardware and innovations.",
    location: "Seoul, South Korea",
    startDate: "2026-12-08",
    endDate: "2026-12-10",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
    maxAttendees: 8000,
    registeredAttendees: 6800,
    ticketPrice: 149,
    tags: ["Gaming", "Esports", "Technology", "Entertainment"],
  },
  {
    _id: "11",
    title: "Luxury Fashion Summit",
    description:
      "Exclusive showcase of haute couture, luxury brands, and high-end fashion innovations from around the world.",
    location: "Milan, Italy",
    startDate: "2026-10-12",
    endDate: "2026-10-15",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    maxAttendees: 1800,
    registeredAttendees: 1420,
    ticketPrice: 750,
    tags: ["Luxury", "Couture", "HighFashion", "Designer"],
  },
  {
    _id: "12",
    title: "International Street Food Festival",
    description:
      "Taste authentic street food from 50+ countries with live cooking shows and culinary competitions.",
    location: "Bangkok, Thailand",
    startDate: "2026-08-05",
    endDate: "2026-08-07",
    category: "Food",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    maxAttendees: 12000,
    registeredAttendees: 10800,
    ticketPrice: 89,
    tags: ["StreetFood", "Culinary", "Festival", "Global"],
  },
  {
    _id: "13",
    title: "Modern Art & Design Fair",
    description:
      "Celebrate contemporary art, design, and architecture with immersive installations and artist talks.",
    location: "Berlin, Germany",
    startDate: "2026-09-18",
    endDate: "2026-09-21",
    category: "Art",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg",
    maxAttendees: 3200,
    registeredAttendees: 2780,
    ticketPrice: 220,
    tags: ["ModernArt", "Design", "Architecture", "Installation"],
  },
  {
    _id: "14",
    title: "Quantum Computing Conference",
    description:
      "Explore quantum algorithms, hardware breakthroughs, and practical applications of quantum technology.",
    location: "Boston, USA",
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3559483/pexels-photo-3559483.jpeg",
    maxAttendees: 2200,
    registeredAttendees: 1980,
    ticketPrice: 650,
    tags: ["Quantum", "Computing", "Science", "Research"],
  },
  {
    _id: "15",
    title: "Sustainable Fashion Event",
    description:
      "Showcasing eco-friendly fashion, circular economy, and ethical production practices for the future.",
    location: "Amsterdam, Netherlands",
    startDate: "2026-07-30",
    endDate: "2026-08-01",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1461260/pexels-photo-1461260.jpeg",
    maxAttendees: 2600,
    registeredAttendees: 2340,
    ticketPrice: 175,
    tags: ["Sustainable", "EcoFashion", "Ethical", "Circular"],
  },
  {
    _id: "16",
    title: "HealthTech & Biotech Summit",
    description:
      "Revolutionary healthcare technologies, medical AI, biotech innovations, and digital health solutions.",
    location: "Zurich, Switzerland",
    startDate: "2026-09-28",
    endDate: "2026-09-30",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/4164872/pexels-photo-4164872.jpeg",
    maxAttendees: 4500,
    registeredAttendees: 4120,
    ticketPrice: 525,
    tags: ["HealthTech", "Biotech", "MedicalAI", "Healthcare"],
  },
  {
    _id: "17",
    title: "Creative Directors Forum",
    description:
      "Where top creative directors share strategies for brand storytelling, visual identity, and innovation.",
    location: "Los Angeles, USA",
    startDate: "2026-06-22",
    endDate: "2026-06-24",
    category: "Business",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    maxAttendees: 1500,
    registeredAttendees: 1480,
    ticketPrice: 799,
    tags: ["Creative", "Branding", "Design", "Leadership"],
  },
  {
    _id: "18",
    title: "Space Tech & Aerospace Events",
    description:
      "Latest in space exploration, satellite technology, aerospace engineering, and commercial spaceflight.",
    location: "Cape Canaveral, USA",
    startDate: "2026-12-15",
    endDate: "2026-12-17",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1166751/pexels-photo-1166751.jpeg",
    maxAttendees: 6800,
    registeredAttendees: 5920,
    ticketPrice: 425,
    tags: ["Space", "Aerospace", "Satellite", "Exploration"],
  },
];

const CATEGORIES = [
  "All", "Technology", "Fashion", "Food", "Art", "Business", "Science", "Other",
];

const CAT_ICONS = {
  Technology: "💻", Fashion: "👗", Food: "🍕",
  Art: "🎨", Business: "💼", Science: "🔬", Other: "✨",
};

const TICKER = [
  "🔴 LIVE: AI Summit Dubai",
  "🟡 SOON: Paris Fashion Week",
  "🔴 LIVE: World Food Festival Tokyo",
  "🟣 FEATURED: Art Biennale NYC",
  "🔴 LIVE: Digital Marketing Summit Mumbai",
  "🟡 SOON: Gaming Event Seoul",
  "🟣 FEATURED: Science Event London",
];

/* ════════════════════════════════════════════════════════════ */
export default function EventsPage() {
  const [category, setCategory]         = useState("All");
  const [status, setStatus]             = useState("All");
  const {user} = useAuth();
  const [search, setSearch]             = useState("");
  const [viewMode, setViewMode]         = useState("grid");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // ── DATA STATE ──────────────────────────────────────────────
  const [allEvents, setAllEvents] = useState(STATIC_EVENTS); // starts with static
  const [usingLive, setUsingLive] = useState(false);         // true once API responds

  const headerRef = useRef(null);

  // ── FETCH FROM API on mount ──────────────────────────────────
  useEffect(() => {
    eventAPI.getAll()
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setAllEvents([...data.events, ...STATIC_EVENTS]);
          setUsingLive(true);
        }
        // if DB is empty, keep showing static data — site still looks great
      })
      .catch(() => {
        // API unreachable — silently keep static data
      });
  }, []);

  // ── REFRESH after creating a new event ──────────────────────
  const handleModalClose = () => {
    setCreateModalOpen(false);
    // re-fetch so the new event appears immediately
    eventAPI.getAll()
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setAllEvents([...data.events, ...STATIC_EVENTS]);
          setUsingLive(true);
        }
      })
      .catch(() => {});
  };

  // ── CLIENT-SIDE FILTERING ───────────────────────────────────
  const isActive = category !== "All" || status !== "All" || search !== "";
  const reset = () => { setCategory("All"); setStatus("All"); setSearch(""); };

  const filtered = allEvents.filter((e) => {
    const mc = category === "All" || e.category === category;
    const ms = status === "All" || e.status === status;
    const mq =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return mc && ms && mq;
  });

  return (
    <>
      <div className="ep-root">
        <div className="ep-mesh" />

        <div className="ep-inner">
          {/* ── HERO ── */}
          <header className="ep-hero" ref={headerRef}>
            <div className="ep-hero-left">
              <div className="ep-eyebrow">
                <div className="ep-eyebrow-line" />
                <div className="ep-eyebrow-dot" />
                EventSphere — Event Directory
              </div>
              <h1 className="ep-title">
                Discover the world's
                <br />
                most <em>extraordinary</em>
                <br />
                events
              </h1>
              <p className="ep-subtitle">
                Curated events across technology, art, fashion, science &amp;
                more. Find your next great experience.
              </p>
            </div>
          </header>

          {/* ── TICKER ── */}
          <div className="ep-ticker-wrap">
            <div className="ep-ticker-track">
              {[...TICKER, ...TICKER].map((t, i) => (
                <div key={i} className="ep-ticker-item">
                  {t}
                  <div className="ep-ticker-sep" />
                </div>
              ))}
            </div>
          </div>

          {/* ── FILTER PANEL ── */}
          <div className="ep-filter-panel">
            <div className="ep-filter-top">
              <div className="ep-search-wrap">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="ep-search"
                  placeholder="Search by title or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select className="ep-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Live Now</option>
                <option value="completed">Completed</option>
              </select>

              <div className="ep-view-toggle">
                <button className={`ep-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z" />
                  </svg>
                </button>
                <button className={`ep-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ep-filter-divider" />

            <div className="ep-filter-bottom">
              <div className="ep-pills">
                {CATEGORIES.map((cat) => (
                  <button key={cat} className={`ep-pill ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>
                    {cat !== "All" && <span className="ep-pill-icon">{CAT_ICONS[cat]}</span>}
                    {cat}
                  </button>
                ))}
              </div>

              <div className="ep-filter-meta">
                <div className="ep-count-label">
                  <strong>{filtered.length}</strong> events found
                  {usingLive && <span style={{ fontSize: "11px", marginLeft: "8px", color: "#4ade80" }}>● live</span>}
                </div>
                {isActive && (
                  <button className="ep-clear" onClick={reset}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

         {user?.role === "admin" && (
<div className="ep-create-wrap">
  <button className="ep-create-btn" onClick={() => setCreateModalOpen(true)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Event
            </button>
          </div>
          )}

          {/* ── RESULTS HEADER ── */}
          <div className="ep-results-head">
            <h2 className="ep-results-heading">
              {category === "All" ? (<>All <span>events</span></>) : (<><span>{category}</span> events</>)}
            </h2>
            <div className="ep-results-meta">
              {filtered.length} of {allEvents.length} total
            </div>
          </div>

          {/* ── CARDS ── */}
          {filtered.length === 0 ? (
            <div className="ep-empty">
              <span className="ep-empty-glyph">🔍</span>
              <h3 className="ep-empty-title">Nothing found</h3>
              <p className="ep-empty-sub">Try adjusting your filters or clearing the search.</p>
              <button className="ep-empty-btn" onClick={reset}>Reset all filters</button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "ep-grid" : "ep-list"}>
              {filtered.map((events) => (
                <EventCard key={events._id} events={events} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE EVENT MODAL ── */}
      <CreateEventModal open={createModalOpen} onClose={handleModalClose} onCreated={handleModalClose} />
    </>
  );
}