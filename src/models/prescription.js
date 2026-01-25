const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", unique: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  diagnosis: String,
  medicines: [
    {
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }
  ],

  notes: String,
  pdfUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
