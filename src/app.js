require("dotenv").config(); 
const express=require("express");
const connectDB=require("./config/database");
const app=express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const appointmentRoutes = require("./routes/appointmentsRoutes");
app.use("/api/appointments", appointmentRoutes);

const autoExpireAppointments = require("./utils/autoExpireAppointments");

connectDB()
.then(()=>{
    console.log("Database connection established...");
    autoExpireAppointments()
    app.listen(2123,()=>{
     console.log("Server is successfully listening on port 2123...");

    });
})
.catch((err)=>{
    console.error("Database cannot be connected");
});





