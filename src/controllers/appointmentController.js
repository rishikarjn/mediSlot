const Appointment = require("../models/appointment");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;

    // Only patient can create
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user.id })
        .populate("doctor", "name email");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user.id })
        .populate("patient", "name email");
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAppointment,
  getMyAppointments
};