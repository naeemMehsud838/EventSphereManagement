// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Billing", "Technical", "Security", "General"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "Closed"],
      default: "Open",
    },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
