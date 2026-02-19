const Appointment = require("../models/appointment");
const User = require("../models/user");

const updateDoctorReliability = async (doctorId) => {
  try {
    const appointments = await Appointment.find({ doctorId });

    let score = 100;

    appointments.forEach((appt) => {
      if (appt.status === "completed") score += 5;
      if (appt.status === "cancelled") score -= 10;
      if (appt.status === "expired") score -= 5;
    });

    // Keep score within 0–100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    await User.findByIdAndUpdate(doctorId, {
      reliabilityScore: score
    });

  } catch (error) {
    console.log("Error updating reliability:", error.message);
  }
};

module.exports = updateDoctorReliability;
