import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminSchedule.css";
import CreateEventModal from "../../components/events/CreateEventModal";
import { scheduleAPI } from "../../api";

// ✅ 12 May 2026 se 25 May 2026 - HAR DIN 3 EVENTS (original static data preserved)
const STATIC_SCHEDULE = [
  { id: 1,  event: "Morning Yoga 🧘‍♀️", date: "2026-05-12", time: "06:30 AM", emoji: "🧘‍♀️" },
  { id: 2,  event: "Team Standup 💼",   date: "2026-05-12", time: "09:00 AM", emoji: "💼"  },
  { id: 3,  event: "Lunch Meet 🍽️",    date: "2026-05-12", time: "01:00 PM", emoji: "🍽️" },
  { id: 4,  event: "Gym Session 💪",    date: "2026-05-13", time: "07:00 AM", emoji: "💪"  },
  { id: 5,  event: "Code Review 👨‍💻",  date: "2026-05-13", time: "11:00 AM", emoji: "👨‍💻"},
  { id: 6,  event: "Movie Night 🎬",    date: "2026-05-13", time: "08:00 PM", emoji: "🎬"  },
  { id: 7,  event: "Coffee Break ☕",   date: "2026-05-14", time: "10:00 AM", emoji: "☕"  },
  { id: 8,  event: "Client Call 📞",    date: "2026-05-14", time: "03:00 PM", emoji: "📞"  },
  { id: 9,  event: "Dinner Party 🍕",   date: "2026-05-14", time: "07:30 PM", emoji: "🍕"  },
  { id: 10, event: "Running 🏃‍♂️",     date: "2026-05-15", time: "05:30 AM", emoji: "🏃‍♂️"},
  { id: 11, event: "Workshop 🎓",       date: "2026-05-15", time: "02:00 PM", emoji: "🎓"  },
  { id: 12, event: "Game Night 🎮",     date: "2026-05-15", time: "09:00 PM", emoji: "🎮"  },
  { id: 13, event: "Meditation 🧠",     date: "2026-05-16", time: "06:00 AM", emoji: "🧠"  },
  { id: 14, event: "Design Review 🎨",  date: "2026-05-16", time: "10:30 AM", emoji: "🎨"  },
  { id: 15, event: "Concert 🎤",        date: "2026-05-16", time: "08:00 PM", emoji: "🎤"  },
  { id: 16, event: "Swimming 🏊‍♂️",    date: "2026-05-17", time: "07:30 AM", emoji: "🏊‍♂️"},
  { id: 17, event: "Product Demo 📱",   date: "2026-05-17", time: "11:30 AM", emoji: "📱"  },
  { id: 18, event: "BBQ Party 🍖",      date: "2026-05-17", time: "06:00 PM", emoji: "🍖"  },
  { id: 19, event: "Pilates 🧘",        date: "2026-05-18", time: "08:00 AM", emoji: "🧘"  },
  { id: 20, event: "Marketing Meet 📈", date: "2026-05-18", time: "12:00 PM", emoji: "📈"  },
  { id: 21, event: "Karaoke 🎙️",       date: "2026-05-18", time: "09:30 PM", emoji: "🎙️" },
  { id: 22, event: "Cycling 🚴‍♂️",     date: "2026-05-19", time: "06:30 AM", emoji: "🚴‍♂️"},
  { id: 23, event: "Sprint Planning 🏃‍♀️", date: "2026-05-19", time: "10:00 AM", emoji: "🏃‍♀️"},
  { id: 24, event: "Comedy Show 😂",    date: "2026-05-19", time: "08:00 PM", emoji: "😂"  },
  { id: 25, event: "Meditation 🕉️",    date: "2026-05-20", time: "05:45 AM", emoji: "🕉️" },
  { id: 26, event: "UI Review 🎨",      date: "2026-05-20", time: "02:30 PM", emoji: "🎨"  },
  { id: 27, event: "Dance Class 💃",    date: "2026-05-20", time: "07:00 PM", emoji: "💃"  },
  { id: 28, event: "Gym 🏋️‍♂️",        date: "2026-05-21", time: "07:00 AM", emoji: "🏋️‍♂️"},
  { id: 29, event: "Sales Call 💰",     date: "2026-05-21", time: "04:00 PM", emoji: "💰"  },
  { id: 30, event: "Trivia Night 🧠",   date: "2026-05-21", time: "08:30 PM", emoji: "🧠"  },
  { id: 31, event: "Walk 🚶‍♀️",        date: "2026-05-22", time: "06:00 AM", emoji: "🚶‍♀️"},
  { id: 32, event: "Retro Meeting 📊",  date: "2026-05-22", time: "03:00 PM", emoji: "📊"  },
  { id: 33, event: "Live Music 🎸",     date: "2026-05-22", time: "09:00 PM", emoji: "🎸"  },
  { id: 34, event: "Yoga 🧘‍♂️",        date: "2026-05-23", time: "06:30 AM", emoji: "🧘‍♂️"},
  { id: 35, event: "Demo Day 🚀",       date: "2026-05-23", time: "11:00 AM", emoji: "🚀"  },
  { id: 36, event: "Ice Cream 🍦",      date: "2026-05-23", time: "07:00 PM", emoji: "🍦"  },
  { id: 37, event: "Run 🏃",            date: "2026-05-24", time: "05:30 AM", emoji: "🏃"  },
  { id: 38, event: "Team Lunch 🍲",     date: "2026-05-24", time: "01:00 PM", emoji: "🍲"  },
  { id: 39, event: "Poetry Night 📖",   date: "2026-05-24", time: "08:00 PM", emoji: "📖"  },
  { id: 40, event: "Gym 💪",            date: "2026-05-25", time: "07:30 AM", emoji: "💪"  },
  { id: 41, event: "Final Review ✅",   date: "2026-05-25", time: "03:30 PM", emoji: "✅"  },
  { id: 42, event: "Celebration 🎉",    date: "2026-05-25", time: "07:00 PM", emoji: "🎉"  },
];

const AdminSchedule = () => {
  const [selectedDate,    setSelectedDate]    = useState(new Date("2026-05-12"));
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [extraItems,      setExtraItems]      = useState([]);

  useEffect(() => {
    scheduleAPI.getAll()
      .then(({ schedules }) => {
        if (schedules?.length > 0) setExtraItems(schedules);
      })
      .catch(() => {});
  }, []);

  const allSchedule = [...STATIC_SCHEDULE, ...extraItems];

  const eventsForDate = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    return allSchedule.filter((event) => event.date === selectedDateStr);
  }, [selectedDate, extraItems]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      const hasEvent = allSchedule.some((event) => event.date === dateStr);
      return hasEvent ? <div className="event-dot">●</div> : null;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const handleModalClose = () => setCreateModalOpen(false);

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <div className="header-content">
          <span className="header-emoji">📅</span>
          <h2>Event Schedule (May 2026)</h2>
        </div>
        <button className="add-btn" onClick={() => setCreateModalOpen(true)}>
          ➕ Add Event
        </button>
      </div>

      <div className="schedule-grid">
        <div className="calendar-box">
          <div className="box-header">
            <span className="box-emoji">📆</span>
            <h3>May 2026</h3>
          </div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            minDate={new Date("2026-05-12")}
            maxDate={new Date("2026-05-25")}
          />
          <div className="selected-date">
            📅 <strong>{formatDate(selectedDate)}</strong>
          </div>
        </div>

        <div className="schedule-box">
          <div className="box-header">
            <span className="box-emoji">📋</span>
            <h3>
              {eventsForDate.length
                ? `${eventsForDate.length} Events Today`
                : "No Events Found"}
            </h3>
          </div>

          <div className="schedule-list">
            {eventsForDate.length > 0 ? (
              eventsForDate.map((item) => (
                <div className="schedule-card highlighted" key={item.id || item._id}>
                  <div className="card-content">
                    <span className="event-emoji">{item.emoji}</span>
                    <div className="event-details">
                      <h4>{item.event}</h4>
                      <p>{item.date}</p>
                    </div>
                    <span className="event-time">{item.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <span className="no-events-emoji">🔍</span>
                <p>
                  No Events Found
                  <br />
                  <small>Try selecting a date with ● dot</small>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateEventModal open={createModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default AdminSchedule;