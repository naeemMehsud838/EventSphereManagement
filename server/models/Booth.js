// models/Booth.js
const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Booth name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Booth description is required"],
    },
    category: {
      type: String,
      enum: ["Technology", "Design", "Business", "Healthcare", "Environment", "AI", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: [true, "Booth location / hall is required"],
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booth", boothSchema);
