// controllers/booking.controller.js
const Booking = require("../models/Booking");
const Event   = require("../models/Event");

// ─── BOOK AN EVENT (Attendee) ─────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { eventId, sessionTitle, sessionTime, hallLocation } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.registeredAttendees >= event.maxAttendees) {
      return res.status(400).json({ success: false, message: "Event is fully booked" });
    }

    const booking = await Booking.create({
      attendee: req.session.user._id,
      event: eventId,
      ticketPrice: event.ticketPrice,
      sessionTitle,
      sessionTime,
      hallLocation,
    });

    // Increment registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredAttendees: 1 } });

    await booking.populate("event", "title startDate location");
    res.status(201).json({ success: true, message: "Booking created", booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "You already booked this event" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET MY BOOKINGS (Attendee) ───────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ attendee: req.session.user._id })
      .populate("event", "title startDate endDate location coverImage category")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL BOOKINGS (Admin) ─────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate("attendee", "name email")
      .populate("event", "title startDate location")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── APPROVE / REJECT BOOKING (Admin) ────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Confirmed", "Rejected", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("attendee", "name email").populate("event", "title");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANCEL BOOKING (Attendee - own booking) ──────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, attendee: req.session.user._id },
      { status: "Cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Decrement registered count
    await Event.findByIdAndUpdate(booking.event, { $inc: { registeredAttendees: -1 } });

    res.json({ success: true, message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking };
