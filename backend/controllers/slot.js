const Slot = require("../models/slot.js");
const findSlotDetails = (mySlot) => {
  const ind = mySlot.indexOf("-");
  const date = mySlot.slice(0, ind).trim();
  const time = mySlot.slice(ind + 1).trim();
  return { date, time };
};
async function rollback(slots) {
  for (let i = 0; i < slots.length; i++) {
    const { _id } = slots[i];
    await Slot.findOneAndDelete({
      _id,
    });
  }
}
// GET /slots - Get all slots (and clean expired holds)
async function getSlots(req, res) {
  try {
    // 2. Return all slots (or filter by date if you want)
    const slots = await Slot.find();
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots." });
  }
}

// POST /slots/hold - Hold a slot temporarily
//  -> takes date,time,userId from user
async function holdSlot(req, res) {
  const { userId, selectedSlots } = req.body;
  async function holdSlotFor(date, time, userId) {
    let slot = await Slot.findOne({ date, time });
    if (!slot) {
      slot = await Slot.create({
        date,
        time,
        status: "pending",
        userId,
        holdUntil: new Date(Date.now() + 3 * 60 * 1000),
      });
    } else if (slot.status === "available") {
      slot.status = "pending";
      slot.userId = userId;
      slot.holdUntil = new Date(Date.now() + 3 * 60 * 1000);
      await slot.save();
    } else {
      return null; // not available
    }
    return slot; // return the doc
  }

  let heldSlots = []; // last processed slot doc
  for (let i = 0; i < selectedSlots.length; i++) {
    const { date, time } = findSlotDetails(selectedSlots[i]);
    const held = await holdSlotFor(date, time, userId);
    if (!held) {
      await rollback(heldSlots);
      return res.status(400).json({ error: "Slot is not available." });
    }
    heldSlots = [...heldSlots, held];
  }

  return res.json({ message: "Slot held successfully.", heldSlots });
}

// takes date,time from req.body and confirms only held slots
async function confirmSlot(req, res) {
  const { heldSlots } = req.body;
  let confirmedSlots = [];
  for (let i = 0; i < heldSlots.length; i++) {
    const { date, time, userId } = heldSlots[i];
    let slot = await Slot.findOneAndUpdate(
      {
        userId,
        date,
        time,
      },
      {
        $set: { status: "booked" },
        $unset: { holdUntil: 1 },
      },
      { new: true }
    );
    //following handles those cases where the slot is held,payment is done but has expired and has been cleared by api call by another user
    if (!slot)
      slot = await Slot.create({
        date,
        time,
        status: "booked",
        userId,
      });
    if (slot) confirmedSlots = [...confirmedSlots, slot];
    else {
      await rollback(confirmedSlots);
      console.log("Could not confirm all the held slots,so rolling back");
      return res.status(500).json({ status: "failure" });
    }
  }

  return res
    .status(200)
    .json({ message: "All held slots confirmed", confirmedSlots });
}
//clears/makes available those slots whose expiry has crossed
async function releaseHolds(req, res) {
  async function releaseHoldsFor(date, time, userId) {
    await Slot.findOneAndDelete({ date, time, userId });
  }
  const { userId, selectedSlots } = req.body;
  for (let i = 0; i < selectedSlots.length; i++) {
    const { date, time } = findSlotDetails(selectedSlots[i]);
    await releaseHoldsFor(date, time, userId);
  }
}
module.exports = {
  confirmSlot,
  holdSlot,
  getSlots,
  releaseHolds,
};
