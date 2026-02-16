const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

  date: Date,
  timeSlot: String,

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "expired", "no-show"],
    default: "pending"
  }
}, { timestamps: true });

// Prevent double booking
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

