// const User = require("../models/user");

// const getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: "doctor" })
//       .select("name specialization reliabilityScore");

//     res.status(200).json(doctors);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getAllDoctors
// };

const Doctor = require("../models/doctor");
const User = require("../models/User"); 

// Create Doctor Profile
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      experience,
      consultationFee,
      availability
    } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Check if role is doctor
    if (user.role !== "doctor") {
      return res.status(400).json({ message: "User is not a doctor" });
    }

    // 3️⃣ Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });

    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists" });
    }

    // 4️⃣ Create doctor profile
    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
      consultationFee,
      availability
    });

    res.status(201).json(doctor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createDoctor };
