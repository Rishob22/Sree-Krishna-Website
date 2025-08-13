const express = require("express");
const {
  holdSlot,
  getSlots,
  confirmSlot,
  releaseHolds,
} = require("../controllers/slot.js");
const clearExpiredSlots = require("../middlewares/clearExpiredSlots.js");
const slotRoute = express.Router();
slotRoute.get("/", clearExpiredSlots, getSlots);
slotRoute.post("/hold", clearExpiredSlots, holdSlot);
slotRoute.post("/", confirmSlot); //no confirmExpiredSlots because razorpay takes care of the time for confirmation..and only on verification from razorpay will I post on confirm
slotRoute.post("/release", releaseHolds);
module.exports = slotRoute;
