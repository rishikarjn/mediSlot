// const express = require("express");
// const router = express.Router();
// const { getAllDoctors } = require("../controllers/doctorController");

// router.get("/", getAllDoctors);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { createDoctor } = require("../controllers/doctorController");

router.post("/", createDoctor);

module.exports = router;