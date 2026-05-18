// routes/auth.routes.js
const express = require("express");
const router  = express.Router();
const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   logout);
router.get("/me",        isAuthenticated, getMe);

module.exports = router;
