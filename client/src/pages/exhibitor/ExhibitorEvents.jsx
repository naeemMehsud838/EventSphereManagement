import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExhibitorEvents.css";
import { eventAPI } from "../../api";

const STATIC_EVENTS = [
  { _id: "s1", title: "Tech Expo 2026",   date: "20 June 2026",    location: "Karachi Expo Center",   description: "A large technology exhibition showcasing startups, AI, and innovation.",    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800" },
  { _id: "s2", title: "Startup Summit",   date: "5 July 2026",     location: "Lahore Convention Hall", description: "Meet investors, founders and explore startup opportunities.",               image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800" },
  { _id: "s3", title: "AI Conference",    date: "18 August 2026",  location: "Islamabad Arena",        description: "Deep learning, machine learning and AI future discussions.",               image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" },
  { _id: "s4", title: "Business Expo",    date: "2 September 2026",location: "Karachi Expo Center",   description: "Networking event for business owners and exhibitors.",                    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800" },
];

export default function ExhibitorEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(STATIC_EVENTS);

  useEffect(() => {
    eventAPI.getAll()
      .then(({ events: e }) => {
        if (e?.length > 0) {
          setEvents([
            ...e.map((ev) => ({
              _id:         ev._id,
              title:       ev.title,
              date:        new Date(ev.startDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
              location:    ev.location,
              description: ev.description,
              image:       ev.coverImage || "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
            })),
            ...STATIC_EVENTS,
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="events-wrapper">
      <h1 className="events-title">Exhibitor Events</h1>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <img src={event.image} alt={event.title} />
            <div className="event-info">
              <h2>{event.title}</h2>
              <p>📅 {event.date}</p>
              <p>📍 {event.location}</p>
              {/* Navigate to full EventsDetail page — no modal */}
              <button onClick={() => navigate(`/events/${event._id}`)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}