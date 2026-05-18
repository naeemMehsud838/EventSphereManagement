// models/Schedule.js
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: [true, "Event/task name is required"],
      trim: true,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" for easy calendar matching
      required: true,
    },
    time: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    emoji: { type: String, default: "📅" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
