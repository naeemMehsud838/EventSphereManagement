// routes/booth.routes.js
const express = require("express");
const router  = express.Router();
const {
  getAllBooths, getBoothById, getMyBooths, createBooth, updateBooth, deleteBooth, updateBoothStatus,
} = require("../controllers/booth.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

// Public
router.get("/",              getAllBooths);

// Exhibitor — MUST be before /:id to avoid being caught by it
router.get("/my/booths",     isAuthenticated, authorizeRoles("exhibitor"), getMyBooths);
router.post("/",             isAuthenticated, authorizeRoles("exhibitor"), createBooth);
router.patch("/:id/status",  isAuthenticated, authorizeRoles("admin"), updateBoothStatus);
router.put("/:id",           isAuthenticated, authorizeRoles("exhibitor", "admin"), updateBooth);
router.delete("/:id",        isAuthenticated, authorizeRoles("exhibitor", "admin"), deleteBooth);
router.get("/:id",           getBoothById);

module.exports = router;