const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    unique: true,
    required: true
  },

  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  consultationFee: { type: Number, required: true },

  // ✅ Dynamic working hours
  workingHours: {
    startTime: { type: String, default: "09:00" },
    endTime: { type: String, default: "17:00" },
    slotDuration: { type: Number, default: 30 }
  },

  // ✅ Use 0–5 rating style
  reliabilityScore: { type: Number, default: 4.5 },

  stats: {
    totalAppointments: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    delayed: { type: Number, default: 0 }
  }

}, { timestamps: true });

// Performance index
// doctorSchema.index({ userId: 1 });

module.exports = mongoose.model("Doctor", doctorSchema);