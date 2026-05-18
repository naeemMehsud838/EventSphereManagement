// controllers/ticket.controller.js
const Ticket = require("../models/Ticket");

// ─── CREATE TICKET ────────────────────────────────────────
const createTicket = async (req, res) => {
  try {
    const { subject, category, priority, description } = req.body;
    const ticket = await Ticket.create({
      user: req.session.user._id,
      subject, category, priority, description,
    });
    await ticket.populate("user", "name email");
    res.status(201).json({ success: true, message: "Ticket created", ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET MY TICKETS ───────────────────────────────────────
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL TICKETS (Admin) ──────────────────────────────
const getAllTickets = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE TICKET STATUS (Admin) ────────────────────────
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Open", "Pending", "Closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("user", "name email");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, message: "Ticket updated", ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE TICKET (Admin) ───────────────────────────────
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicketStatus, deleteTicket };
