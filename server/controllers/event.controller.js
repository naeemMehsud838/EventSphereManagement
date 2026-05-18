// controllers/event.controller.js
const Event = require("../models/Event");

// ─── GET ALL EVENTS (public) ──────────────────────────────
const getAllEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SINGLE EVENT (public) ────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE EVENT (Admin only) ────────────────────────────
const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, startDate, endDate, ticketPrice, maxAttendees, tags } = req.body;

    const eventData = {
      title, description, category, location,
      startDate, endDate, ticketPrice, maxAttendees,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      createdBy: req.session.user._id,
    };

    // Handle cover image upload
    if (req.file) {
      eventData.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const event = await Event.create(eventData);
    res.status(201).json({ success: true, message: "Event created", event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE EVENT (Admin only) ────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.tags && !Array.isArray(req.body.tags)) {
      updateData.tags = req.body.tags.split(",").map((t) => t.trim());
    }

    if (req.file) {
      updateData.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE EVENT (Admin only) ────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DASHBOARD STATS (Admin) ──────────────────────────────
const getAdminStats = async (req, res) => {
  try {
    const User    = require("../models/User");
    const Booking = require("../models/Booking");

    const [totalEvents, totalAttendees, totalExhibitors, bookings] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments({ role: "attendee" }),
      User.countDocuments({ role: "exhibitor" }),
      Booking.find({ paymentStatus: "paid" }).select("ticketPrice"),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.ticketPrice || 0), 0);
    const ticketsSold  = bookings.length;

    res.json({
      success: true,
      stats: { totalEvents, totalAttendees, totalExhibitors, totalRevenue, ticketsSold },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getAdminStats };
