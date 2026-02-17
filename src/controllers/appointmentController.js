const Appointment = require("../models/appointment");

const createAppointment = async (req, res) => {
  try {
    const { doctorId,date,timeSlot } = req.body;

    // Only patient can create
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId: doctorId,
      date:date,
     timeSlot:timeSlot
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
     if (error.code === 11000) {
    return res.status(400).json({
      message: "This time slot is already booked for this doctor"
    });
  }

    res.status(500).json({ message: error.message });
  }
};


const getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patientId: req.user.id })
        .populate("doctorId", "name email");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctorId: req.user.id })
        .populate("patientId", "name email");
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1️⃣ Only doctor can update
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Only doctors can update appointment status"
      });
    }

    // 2️⃣ Validate status value
    // if (!["confirmed", "cancelled"].includes(status)) {
    //   return res.status(400).json({
    //     message: "Invalid status value"
    //   });
    // }

    // 3️⃣ Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // 4️⃣ Ensure doctor owns this appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this appointment"
      });
    }


    //Transition Rules
     const currentStatus = appointment.status;

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed"],
    };

    if (!validTransitions[currentStatus] ||
        !validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${status}`
      });
    }

    // 5️⃣ Update status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus
};