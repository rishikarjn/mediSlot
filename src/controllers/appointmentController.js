const Appointment = require("../models/appointment");
const User = require("../models/User"); 

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const doctor = await User.findById(doctorId);
//  const doctor = await Doctor.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

  if (
  doctor.role !== "doctor" ||
  !doctor.availableSlots ||
  !doctor.availableSlots.includes(timeSlot)
) {
  return res.status(400).json({
    message: "Selected time slot not available for this doctor"
  });
}

    const selectedDate = new Date(date);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: selectedDate,
      timeSlot
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This slot is already booked"
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date: selectedDate,
      timeSlot
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.user.role === "patient") {
      filter.patientId = req.user.id;
    } else if (req.user.role === "doctor") {
      filter.doctorId = req.user.id;
    }

    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
      data: appointments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// const getMyAppointments = async (req, res) => {
//   try {
//     let appointments;

//     if (req.user.role === "patient") {
//       appointments = await Appointment.find({ patientId: req.user.id })
//         .populate("doctorId", "name email");
//     } else if (req.user.role === "doctor") {
//       appointments = await Appointment.find({ doctorId: req.user.id })
//         .populate("patientId", "name email");
//     }

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



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
      pending: ["confirmed", "cancelled","completed"],
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

const updateDoctorReliability = require("../utils/reliabilityCalculator");
await updateDoctorReliability(appointment.doctorId);


    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const Doctor = require("../models/doctor");
const generateTimeSlots = require("../utils/slotGenerator");
const scoreSlots = require("../utils/slotScoring");

const smartRecommend = async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;

    // 1️⃣ Fetch doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2️⃣ Generate all possible slots (using working hours)
    // You can store these in doctor model later
    const startTime = doctor.startTime || "09:00";
    const endTime = doctor.endTime || "17:00";
    const interval = doctor.slotDuration || 30;

    const allSlots = generateTimeSlots(startTime, endTime, interval);

    // 3️⃣ Fetch already booked slots (excluding cancelled)
    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      status: { $ne: "cancelled" },
    }).select("timeSlot");

    const bookedSlots = bookedAppointments.map(a => a.timeSlot);

    // 4️⃣ Filter available slots
    const availableSlots = allSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    if (availableSlots.length === 0) {
      return res.status(200).json({
        message: "No available slots",
        recommendedSlots: [],
      });
    }

    // 5️⃣ Score available slots
    const scoredSlots = await scoreSlots({
      availableSlots,
      doctor,
      patientId,
    });

    // 6️⃣ Return top 3 recommended slots
    const topRecommendations = scoredSlots.slice(0, 3);

    res.status(200).json({
      doctor: doctor.name,
      recommendedSlots: topRecommendations,
    });

  } catch (error) {
    console.error("Smart Recommendation Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  smartRecommend
};


