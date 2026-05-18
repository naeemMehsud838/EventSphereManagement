// controllers/booth.controller.js
const Booth = require("../models/Booth");

// ─── GET ALL BOOTHS (public) ──────────────────────────────
const getAllBooths = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;

    const booths = await Booth.find(filter)
      .populate("exhibitor", "name email company")
      .populate("event", "title startDate")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: booths.length, booths });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SINGLE BOOTH ─────────────────────────────────────
const getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id)
      .populate("exhibitor", "name email company avatar")
      .populate("event", "title startDate location");
    if (!booth) return res.status(404).json({ success: false, message: "Booth not found" });
    res.json({ success: true, booth });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET MY BOOTHS (Exhibitor) ────────────────────────────
const getMyBooths = async (req, res) => {
  try {
    const booths = await Booth.find({ exhibitor: req.session.user._id })
      .populate("event", "title startDate")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: booths.length, booths });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE BOOTH (Exhibitor) ─────────────────────────────
const createBooth = async (req, res) => {
  try {
    const { name, description, category, location, contactEmail, event } = req.body;

    const booth = await Booth.create({
      name, description, category, location, contactEmail,
      event: event || undefined,
      exhibitor: req.session.user._id,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Booth created and pending approval", booth });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE BOOTH (Exhibitor - own booths only) ───────────
const updateBooth = async (req, res) => {
  try {
    const booth = await Booth.findOne({ _id: req.params.id, exhibitor: req.session.user._id });
    if (!booth) return res.status(404).json({ success: false, message: "Booth not found or not yours" });

    Object.assign(booth, req.body);
    await booth.save();

    res.json({ success: true, message: "Booth updated", booth });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE BOOTH ─────────────────────────────────────────
const deleteBooth = async (req, res) => {
  try {
    const query = req.session.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, exhibitor: req.session.user._id };

    const booth = await Booth.findOneAndDelete(query);
    if (!booth) return res.status(404).json({ success: false, message: "Booth not found" });

    res.json({ success: true, message: "Booth deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── APPROVE / REJECT BOOTH (Admin) ──────────────────────
const updateBoothStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const booth = await Booth.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booth) return res.status(404).json({ success: false, message: "Booth not found" });

    res.json({ success: true, message: `Booth ${status}`, booth });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBooths, getBoothById, getMyBooths, createBooth, updateBooth, deleteBooth, updateBoothStatus };
