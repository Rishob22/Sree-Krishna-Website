const Slot = require("../models/slot.js");
const Razorpay = require("razorpay");
const crypto = require("crypto");
//environment variables
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

async function fetchBookedSlots(req, res) {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createOrder(req, res) {
  // Razorpay Instance
  const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  //step 1 : we create an order by taking stuff from the request from the frontend
  const order = await instance.orders.create({
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: req.body.receipt,
  });

  if (!order) res.status(500).json({ status: "failure" });
  res.json(order);
}
async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET; // Secure this in .env

  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature)
    // Save payment details to DB here
    res.json({ status: "success" });
  else res.status(400).json({ status: "failure" });
}
module.exports = {
  fetchBookedSlots,
  verifyPayment,
  createOrder,
};
