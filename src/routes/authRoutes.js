// src/routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);


module.exports = router;


const { protect } = require("../middlewares/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});
