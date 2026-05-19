// routes/user.routes.js
const express  = require("express");
const router   = express.Router();
const {
  getAllUsers, getUserById, updateProfile, changePassword, updateUserStatus, deleteUser,
} = require("../controllers/user.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");
const upload   = require("../middleware/upload.middleware");

// Profile routes FIRST (before /:id)
router.put("/profile/update",   isAuthenticated, upload.single("avatar"), updateProfile);
router.put("/profile/password", isAuthenticated, changePassword);

// Admin - manage all users
router.get("/",          isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.patch("/:id/status", isAuthenticated, authorizeRoles("admin"), updateUserStatus);
router.delete("/:id",    isAuthenticated, authorizeRoles("admin"), deleteUser);
router.get("/:id",       isAuthenticated, getUserById);

module.exports = router;

// Public — get admin contact (so exhibitors/attendees can message admin)
router.get("/admin/contact", isAuthenticated, async (req, res) => {
  try {
    const User = require("../models/User");
    const admin = await User.findOne({ role: "admin" }).select("_id name email");
    if (!admin) return res.status(404).json({ success: false, message: "No admin found" });
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});