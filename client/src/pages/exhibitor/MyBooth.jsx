import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./MyBooth.css";
import { useNavigate } from "react-router-dom";
import { boothAPI } from "../../api";

const Search = () => <span>🔍</span>;
const MapPin = () => <span>📍</span>;
const Star   = () => <span>⭐</span>;

const STATIC_BOOTHS = [
  { id: "1", name: "Tech Innovators", category: "Technology",  rating: 4.8, location: "Hall A" },
  { id: "2", name: "Creative Studio",  category: "Design",      rating: 4.6, location: "Hall B" },
  { id: "3", name: "AI Lab",           category: "AI",          rating: 4.9, location: "Hall C" },
  { id: "4", name: "Startup Hub",      category: "Business",    rating: 4.7, location: "Hall A" },
  { id: "5", name: "Green Future",     category: "Environment", rating: 4.5, location: "Hall D" },
  { id: "6", name: "Health Zone",      category: "Healthcare",  rating: 4.6, location: "Hall B" },
];

const CATEGORIES = ["All", "Technology", "Design", "AI", "Business", "Environment", "Healthcare"];

const STATUS_STYLE = {
  pending:  { background: "rgba(245,158,11,0.2)",  color: "#fbbf24", label: "⏳ Pending"  },
  approved: { background: "rgba(52,211,153,0.2)",  color: "#34d399", label: "✅ Approved" },
  rejected: { background: "rgba(239,68,68,0.2)",   color: "#f87171", label: "❌ Rejected" },
};

export default function Booth() {
  const navigate = useNavigate();
  const [allBooths, setAllBooths] = useState(STATIC_BOOTHS);
  const [isReal,    setIsReal]    = useState(false);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");

  useEffect(() => {
    boothAPI.getMyBooths()
      .then(({ booths: b }) => {
        if (b?.length > 0) {
          setAllBooths(b.map((booth) => ({
            id:       booth._id,
            name:     booth.name,
            category: booth.category,
            rating:   booth.rating || 4.5,
            location: booth.location || "Hall A",
            status:   booth.status,
          })));
          setIsReal(true);
        }
      })
      .catch(() => {});
  }, []);

  const booths = allBooths.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                        b.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="booth-page">

      <motion.div className="booth-header1" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>🚀 Expo Booths</h1>
        <p>Discover innovation, creativity & technology in one place</p>

        <div className="booth-actions">
          <div className="search-box">
            <Search />
            <input
              placeholder="Search booths..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-btn"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "var(--secondary)", color: "var(--accent)", cursor: "pointer" }}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>

      <div className="booth-grid">
        {booths.length === 0 ? (
          <p style={{ opacity: 0.5, padding: "40px 0" }}>No booths found.</p>
        ) : booths.map((booth, i) => (
          <motion.div
            key={booth.id}
            className="booth-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
          >
            <div className="card-banner">
              <span className="category">{booth.category}</span>
              {isReal && booth.status && (
                <span style={{
                  fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                  borderRadius: "20px", ...STATUS_STYLE[booth.status],
                }}>
                  {STATUS_STYLE[booth.status]?.label}
                </span>
              )}
            </div>

            <div className="card-content">
              <h2>{booth.name}</h2>
              <p className="description">Explore cutting-edge ideas and connect with industry experts.</p>

              <div className="booth-footer">
                <div className="rating"><Star /> {booth.rating}</div>
                <div className="location"><MapPin /> {booth.location}</div>
              </div>

              <motion.button
                className="visit-btn"
                onClick={() => {
                  if (booth.status === "rejected") return;
                  navigate(`/exhibitor/booth/${booth.id}`);
                }}
                whileHover={{ scale: booth.status !== "rejected" ? 1.05 : 1 }}
                whileTap={{ scale: booth.status !== "rejected" ? 0.95 : 1 }}
                style={booth.status === "rejected" ? { opacity: 0.4, cursor: "not-allowed" } : {}}
              >
                {booth.status === "rejected" ? "Booth Rejected" : "Visit Booth →"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}