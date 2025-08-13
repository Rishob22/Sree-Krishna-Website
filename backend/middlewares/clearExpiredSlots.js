const Slot = require("../models/slot.js");
const clearExpiredSlots = async (req, res, next) => {
  const slotsCleared = await Slot.deleteMany({
    status: "pending",
    holdUntil: { $lt: new Date() }, // expired
  });
  if (slotsCleared) {
    console.log("Expired slots cleared");
    next();
  } else {
    console.log("Cant clear expired slots");
    res.json(500).json({ status: "failure" });
  }
};
module.exports = clearExpiredSlots;
