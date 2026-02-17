const cron = require("node-cron");
const Appointment = require("../models/appointment");

const autoExpireAppointments = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      const expiredAppointments = await Appointment.updateMany(
        {
          status: "pending",
          createdAt: { $lt: fifteenMinutesAgo }
        },
        { status: "expired" }
      );

      if (expiredAppointments.modifiedCount > 0) {
        console.log(`Expired ${expiredAppointments.modifiedCount} appointments`);
      }

    } catch (error) {
      console.log("Error expiring appointments:", error.message);
    }
  });
};

module.exports = autoExpireAppointments;
