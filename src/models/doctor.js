const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

  specialization: String,
  experience: Number,
  consultationFee: Number,

  availability: [
    {
      date: Date,
      slots: [String]
    }
  ],

  reliabilityScore: { type: Number, default: 100 },

  stats: {
    totalAppointments: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    delayed: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
