// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["Technology", "Fashion", "Food", "Art", "Business", "Science", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maxAttendees: {
      type: Number,
      default: 1000,
    },
    registeredAttendees: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "draft"],
      default: "upcoming",
    },
    coverImage: {
      type: String,
      default: "",
    },
    tags: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
