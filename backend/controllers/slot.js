const Slot = require("../models/slot.js");

// GET /slots - Get all slots (and clean expired holds)
async function getSlots(req, res) {
  try {
    // 1. Release expired pending slots
    await Slot.updateMany(
      { status: "pending", holdUntil: { $lt: new Date() } },
      {
        $set: { status: "available" },
        $unset: { userId: "", holdUntil: "" },
      }
    );

    // 2. Return all slots (or filter by date if you want)
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots." });
  }
}

// POST /slots/:id/hold - Hold a slot temporarily
async function holdSlot(req, res) {
  const slotId = req.params.id;
  const userId = req.body.userId; // assuming this comes from frontend or req.user

  try {
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: "available" },
      {
        $set: {
          status: "pending",
          userId: userId,
          holdUntil: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
        },
      },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({ error: "Slot is not available." });
    }

    res.json({ message: "Slot held successfully.", slot });
  } catch (err) {
    res.status(500).json({ error: "Failed to hold slot." });
  }
}

// POST /slots/:id/confirm - Confirm a held slot
async function confirmSlot(req, res) {
  const slotId = req.params.id;
  const userId = req.body.userId;

  try {
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: "pending", userId },
      {
        $set: { status: "booked" },
        $unset: { holdUntil: "" },
      },
      { new: true }
    );

    if (!slot) {
      return res
        .status(400)
        .json({ error: "Slot is not in pending state or not owned by you." });
    }

    res.json({ message: "Slot booked successfully.", slot });
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm booking." });
  }
}

// POST /slots/:id/cancel - Cancel a hold or booking
async function cancelSlot(req, res) {
  const slotId = req.params.id;
  const userId = req.body.userId;

  try {
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, userId, status: { $in: ["pending", "booked"] } },
      {
        $set: { status: "available" },
        $unset: { holdUntil: "", userId: "" },
      },
      { new: true }
    );

    if (!slot) {
      return res
        .status(400)
        .json({ error: "Slot is not held or booked by this user." });
    }

    res.json({ message: "Slot cancelled successfully.", slot });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel slot." });
  }
}
module.exports = {
  cancelSlot,
  confirmSlot,
  holdSlot,
  getSlots,
};
