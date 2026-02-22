const Appointment = require("../models/appointment");

async function scoreSlots({
  availableSlots,
  doctor,
  patientId
}) {
  try {
    const scoredSlots = [];

    // 1️⃣ Get patient completed appointment history
    const pastAppointments = await Appointment.find({
      patientId: patientId,
      status: "completed",
    }).select("timeSlot");

    const preferredSlots = pastAppointments.map(a => a.timeSlot);

    // 2️⃣ Get slot popularity in ONE query (performance optimized)
    const bookings = await Appointment.aggregate([
      {
        $match: {
          doctorId: doctor._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$timeSlot",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result into map for fast lookup
    const bookingMap = {};
    bookings.forEach(b => {
      bookingMap[b._id] = b.count;
    });

    // 3️⃣ Score each slot
    for (let slot of availableSlots) {
      let score = 0;

       if (doctor.reliabilityScore) {
        score += doctor.reliabilityScore * 5;
      }

      // ✅ Patient preferred slot bonus (strong personalization)
      if (preferredSlots.includes(slot)) {
        score += 30;
      }

      // ✅ Slot popularity logic
      const bookingCount = bookingMap[slot] || 0;

      // Less booked = higher score
      score += (15 - bookingCount * 2);

      // Prevent negative score
      if (score < 0) score = 0;
      scoredSlots.push({ slot, score });
    }

    // 4️⃣ Sort highest score first
    scoredSlots.sort((a, b) => b.score - a.score);

    return scoredSlots;

  } catch (error) {
    console.error("Error scoring slots:", error);
    throw error;
  }
}

module.exports = scoreSlots;