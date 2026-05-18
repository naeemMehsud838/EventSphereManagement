// routes/ticket.routes.js
const express = require("express");
const router  = express.Router();
const {
  createTicket, getMyTickets, getAllTickets, updateTicketStatus, deleteTicket,
} = require("../controllers/ticket.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

// Any logged in user can create/view own tickets
router.post("/",            isAuthenticated, createTicket);
router.get("/my",           isAuthenticated, getMyTickets);

// Admin
router.get("/",             isAuthenticated, authorizeRoles("admin"), getAllTickets);
router.patch("/:id/status", isAuthenticated, authorizeRoles("admin"), updateTicketStatus);
router.delete("/:id",       isAuthenticated, authorizeRoles("admin"), deleteTicket);

module.exports = router;
