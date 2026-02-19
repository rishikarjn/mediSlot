const User = require("../models/user");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("name specialization reliabilityScore");

    res.status(200).json(doctors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors
};
