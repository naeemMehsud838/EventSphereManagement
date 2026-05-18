// routes/message.routes.js
const express = require("express");
const router  = express.Router();
const {
  sendMessage, getConversation, getInbox, getAllMessages,
} = require("../controllers/message.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/",              isAuthenticated, sendMessage);
router.get("/inbox",          isAuthenticated, getInbox);
router.get("/conversation/:userId", isAuthenticated, getConversation);

// Admin - view all messages
router.get("/all",            isAuthenticated, authorizeRoles("admin"), getAllMessages);

module.exports = router;
