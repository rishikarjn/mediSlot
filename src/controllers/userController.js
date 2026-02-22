const User = require("../models/User"); 

exports.updateUser = async (req, res) => {
  try {
    const { specialization, reliabilityScore } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { specialization, reliabilityScore },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
