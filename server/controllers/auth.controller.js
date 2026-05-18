// controllers/auth.controller.js
const User = require("../models/User");

// ─── REGISTER ────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Attendees need admin approval; everyone else auto-approved
    const status = (role === "attendee" || !role) ? "pending" : "approved";

    const user = await User.create({ name, email, password, role, phone, company, status });

    if (status === "pending") {
      return res.status(201).json({
        success: true,
        pending: true,
        message: "Account created! Please wait for admin approval before logging in.",
      });
    }

    req.session.user = {
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      status: user.status,
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Admins and exhibitors always allowed in regardless of status
    // For attendees: only block if explicitly "pending" or "rejected"
    if (user.role === "attendee") {
      if (user.status === "pending") {
        return res.status(403).json({
          success: false,
          message: "Your account is pending admin approval. Please wait.",
        });
      }
      if (user.status === "rejected") {
        return res.status(403).json({
          success: false,
          message: "Your account registration was rejected. Please contact support.",
        });
      }
    }

    req.session.user = {
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      status: user.status || "approved",
    };

    res.json({
      success: true,
      message: "Logged in successfully",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────────
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
};

// ─── GET ME ──────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, logout, getMe };