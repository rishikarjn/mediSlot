const express = require("express");
const router = express.Router();

const { createAppointment, getMyAppointments,updateAppointmentStatus} =
   require("../controllers/appointmentController");

const { protect } =
  require("../middlewares/authMiddleware");


const { smartRecommendSlots } = 
     require("../controllers/appointmentController");





router.post("/", protect, createAppointment);
router.get("/", protect, getMyAppointments);
router.put("/:id/status", protect, updateAppointmentStatus);
router.get("/smart-slots", smartRecommendSlots);



module.exports = router;
