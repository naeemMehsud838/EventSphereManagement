// routes/event.routes.js
const express = require("express");
const router  = express.Router();
const {
  getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getAdminStats,
} = require("../controllers/event.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");
const upload  = require("../middleware/upload.middleware");

// Public
router.get("/",           getAllEvents);
router.get("/:id",        getEventById);

// Admin only
router.get("/admin/stats",           isAuthenticated, authorizeRoles("admin"), getAdminStats);
router.post("/",                     isAuthenticated, authorizeRoles("admin"), upload.single("coverImage"), createEvent);
router.put("/:id",                   isAuthenticated, authorizeRoles("admin"), upload.single("coverImage"), updateEvent);
router.delete("/:id",                isAuthenticated, authorizeRoles("admin"), deleteEvent);

module.exports = router;
