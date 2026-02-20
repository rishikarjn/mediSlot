// utils/slotGenerator.js

function generateTimeSlots(startTime, endTime, interval = 30) {
  const slots = [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let start = new Date();
  start.setHours(startHour, startMin, 0);

  let end = new Date();
  end.setHours(endHour, endMin, 0);

  while (start < end) {
    const next = new Date(start.getTime() + interval * 60000);

    const slot =
      start.toTimeString().slice(0, 5) +
      " - " +
      next.toTimeString().slice(0, 5);

    slots.push(slot);

    start = next;
  }

  return slots;
}

module.exports = generateTimeSlots;
