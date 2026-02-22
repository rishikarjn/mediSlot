const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor"] },
  isActive: { type: Boolean, default: true },
availableSlots: {
  type: [String],
  default: ["09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30"]
},

}, { timestamps: true });



module.exports = mongoose.models.User || mongoose.model("User", userSchema);
// module.exports = mongoose.model("User", userSchema);


