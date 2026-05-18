import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./BoothDetails.css";
import { boothAPI } from "../../api";

const STATIC_BOOTHS = [
  { id: "1", name: "Tech Innovators", category: "Technology",  rating: 4.8, location: "Hall A", description: "Showcasing the latest in tech innovation and AI solutions." },
  { id: "2", name: "Creative Studio",  category: "Design",      rating: 4.6, location: "Hall B", description: "Creative design solutions for modern businesses."              },
  { id: "3", name: "AI Lab",           category: "AI",          rating: 4.9, location: "Hall C", description: "Cutting-edge artificial intelligence research and demos."      },
  { id: "4", name: "Startup Hub",      category: "Business",    rating: 4.7, location: "Hall A", description: "Connecting startups with investors and mentors."               },
  { id: "5", name: "Green Future",     category: "Environment", rating: 4.5, location: "Hall D", description: "Sustainable solutions for a greener tomorrow."                },
  { id: "6", name: "Health Zone",      category: "Healthcare",  rating: 4.6, location: "Hall B", description: "Innovative healthcare products and wellness solutions."        },
];

export default function BoothDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [booth,    setBooth]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    boothAPI.getById(id)
      .then(({ booth: b }) => setBooth({
        id:          b._id,
        name:        b.name,
        category:    b.category,
        rating:      b.rating || 4.5,
        location:    b.location || "Hall A",
        description: b.description || "Explore cutting-edge ideas at this booth.",
      }))
      .catch(() => {
        // Fall back to static
        const found = STATIC_BOOTHS.find((b) => b.id === id);
        setBooth(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: "white", padding: "40px" }}>Loading...</div>;
  if (!booth)  return <div style={{ color: "white", padding: "40px" }}>Booth not found</div>;

  return (
    <div className="booth-details">
      <div className="booth-card">
        <h1 className="booth-title">🏢 {booth.name}</h1>
        <span className="booth-category">{booth.category}</span>
        <p className="booth-info">{booth.description}</p>
        <div className="rating-box">
          <span>⭐ Rating</span>
          <span>{booth.rating}</span>
        </div>
        <p className="location">📍 Location: {booth.location}</p>
        <button className="back-btn" onClick={() => navigate("/exhibitor/my-booth")}>
          ← Back to Booths
        </button>
      </div>
    </div>
  );
}