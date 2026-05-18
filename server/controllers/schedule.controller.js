// controllers/schedule.controller.js
const Schedule = require("../models/Schedule");

// ─── GET ALL SCHEDULES ────────────────────────────────────
const getAllSchedules = async (req, res) => {
  try {
    const { date } = req.query; // ?date=2026-05-14
    const filter = date ? { date } : {};
    const schedules = await Schedule.find(filter).sort({ date: 1, time: 1 });
    res.json({ success: true, count: schedules.length, schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE SCHEDULE (Admin) ──────────────────────────────
const createSchedule = async (req, res) => {
  try {
    const { event, date, time, emoji } = req.body;
    const schedule = await Schedule.create({
      event, date, time, emoji,
      createdBy: req.session.user._id,
    });
    res.status(201).json({ success: true, message: "Schedule created", schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE SCHEDULE (Admin) ──────────────────────────────
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });
    res.json({ success: true, message: "Schedule updated", schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE SCHEDULE (Admin) ──────────────────────────────
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });
    res.json({ success: true, message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllSchedules, createSchedule, updateSchedule, deleteSchedule };
