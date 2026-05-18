// routes/schedule.routes.js
const express = require("express");
const router  = express.Router();
const {
  getAllSchedules, createSchedule, updateSchedule, deleteSchedule,
} = require("../controllers/schedule.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/",        isAuthenticated, getAllSchedules);
router.post("/",       isAuthenticated, authorizeRoles("admin"), createSchedule);
router.put("/:id",     isAuthenticated, authorizeRoles("admin"), updateSchedule);
router.delete("/:id",  isAuthenticated, authorizeRoles("admin"), deleteSchedule);

module.exports = router;
