// routes/contact.routes.js
const express = require("express");
const router  = express.Router();
const {
  submitContact, getAllContacts, markAsRead, deleteContact,
} = require("../controllers/contact.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

// Public - anyone can submit
router.post("/",           submitContact);

// Admin only
router.get("/",            isAuthenticated, authorizeRoles("admin"), getAllContacts);
router.patch("/:id/read",  isAuthenticated, authorizeRoles("admin"), markAsRead);
router.delete("/:id",      isAuthenticated, authorizeRoles("admin"), deleteContact);

module.exports = router;
