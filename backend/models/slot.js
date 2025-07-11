const mongoose = require("mongoose");
const slotSchema = new mongoose.Schema({
  day: String,
  slot: String,
});
const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;
