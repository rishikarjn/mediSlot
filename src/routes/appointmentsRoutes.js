const express = require("express");
const router = express.Router();

const { createAppointment, getMyAppointments } =
  require("../controllers/appointmentController");

const { protect } =
  require("../middlewares/authMiddleware");

router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);

module.exports = router;
