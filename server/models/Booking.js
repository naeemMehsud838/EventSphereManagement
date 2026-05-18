// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Rejected"],
      default: "Pending",
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    sessionTitle: { type: String },   // optional – which session they booked
    sessionTime:  { type: String },   // e.g. "10:00 AM"
    hallLocation: { type: String },   // e.g. "Hall A"
  },
  { timestamps: true }
);

// Prevent duplicate bookings for the same event by same attendee
bookingSchema.index({ attendee: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
