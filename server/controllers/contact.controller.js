// controllers/contact.controller.js
const Contact = require("../models/Contact");

// ─── SUBMIT CONTACT FORM (public) ────────────────────────
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: "Message sent successfully", contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL CONTACTS (Admin) ─────────────────────────────
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── MARK AS READ (Admin) ─────────────────────────────────
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Marked as read", contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE CONTACT (Admin) ───────────────────────────────
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitContact, getAllContacts, markAsRead, deleteContact };
