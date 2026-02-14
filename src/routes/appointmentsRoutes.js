const express = require("express");
const router = express.Router();

const { createAppointment, getMyAppointments,updateAppointmentStatus} =
  require("../controllers/appointmentController");

const { protect } =
  require("../middlewares/authMiddleware");


router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/status", protect, updateAppointmentStatus);


module.exports = router;
