const mongoose = require("mongoose");
const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 - 10:30"
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "pending", "booked"],
      default: "available",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    holdUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);
const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;
