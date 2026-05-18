// routes/booking.routes.js
const express = require("express");
const router  = express.Router();
const {
  createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking,
} = require("../controllers/booking.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

// Attendee
router.post("/",              isAuthenticated, authorizeRoles("attendee"), createBooking);
router.get("/my",             isAuthenticated, authorizeRoles("attendee"), getMyBookings);
router.patch("/:id/cancel",   isAuthenticated, authorizeRoles("attendee"), cancelBooking);

// Admin
router.get("/",               isAuthenticated, authorizeRoles("admin"), getAllBookings);
router.patch("/:id/status",   isAuthenticated, authorizeRoles("admin"), updateBookingStatus);

module.exports = router;
