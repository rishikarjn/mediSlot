const User = require("../models/User"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctor");

exports.register = async (req, res) => {
  try {
    const {name, email, password, role, specialization, experience, consultationFee, availability} = req.body;

    // 1️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 4️⃣ If doctor → create doctor profile
    if (role === "doctor") {
      await Doctor.create({
        userId: user._id,
        specialization,
        experience,
        consultationFee,
        availability,
        reliabilityScore: 100,
        stats: {
          totalAppointments: 0,
          completed: 0,
          cancelled: 0,
          delayed: 0
        }
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
       message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};








