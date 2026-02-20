async function scoreSlots({
  availableSlots,
  doctor,
  patientId,
  Appointment
}) {

  const scoredSlots = [];

  // Get patient history
  const pastAppointments = await Appointment.find({
    patientId: patientId,
    status: "completed",
  });

  const preferredSlots = pastAppointments.map(a => a.timeSlot);

  for (let slot of availableSlots) {

    let score = 0;

    // 1️⃣ Doctor reliability (50%)
    score += doctor.reliabilityScore * 0.5;

    // 2️⃣ Patient preferred slot bonus
    if (preferredSlots.includes(slot)) {
      score += 20;
    }

    // 3️⃣ Slot popularity (less booked = better)
    const bookingCount = await Appointment.countDocuments({
      doctorId: doctor._id,
      timeSlot: slot,
      status: "completed",
    });

    score += (10 - bookingCount);

    scoredSlots.push({ slot, score });
  }

  // Sort by highest score
  scoredSlots.sort((a, b) => b.score - a.score);

  return scoredSlots;
}

module.exports = scoreSlots;
