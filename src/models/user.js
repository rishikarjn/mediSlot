const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor"] },
  isActive: { type: Boolean, default: true },

specialization: {
  type: String
},
availableSlots: [
  {
    day: {
      type: String
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  }
],
  reliabilityScore: {
  type: Number,
  default: 100,
  min: 0,
  max: 100
}

}, { timestamps: true });




module.exports = mongoose.model("User", userSchema);


