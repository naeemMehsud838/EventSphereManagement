const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS - allow frontend dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // required for sessions / cookies
  })
);

// ─── SESSION ───────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// ─── DATABASE ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── ROUTES ────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/events",   require("./routes/event.routes"));
app.use("/api/booths",   require("./routes/booth.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/tickets",  require("./routes/ticket.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/schedule", require("./routes/schedule.routes"));
app.use("/api/contact",  require("./routes/contact.routes"));

// ─── HEALTH CHECK ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "EventSphere API running 🚀" });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
