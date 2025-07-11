const Slot = require("../models/slot.js");
//environment variables
const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  EMAIL_ID,
  EMAIL_PASSWORD,
  OWNER_EMAIL,
} = process.env;
const Razorpay = require("razorpay");
// Razorpay Instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});
async function fetchBookedSlots(req, res) {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function reserveSlot(req, res) {
  const { day, slot } = req.body;
  try {
    const existing = await Slot.findOne({ day, slot });
    if (existing) return res.status(409).json({ message: "Already booked" });
    const register = Slot.create({ day, slot });
    if (register) res.status(200).json({ status: "success" });
    // // Dummy frontend hold
    // res.json({ day, slot }); //send for registration
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function createOrder(req, res) {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
}
async function getRazorpayKey(req, res) {
  res.json({ key: RAZORPAY_KEY_ID });
}
async function confirmBooking(req, res) {
  const {
    selectedSlots,
    name,
    phone,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  try {
    // ✅ Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    // ✅ Save Slots in DB
    const promises = selectedSlots.map(({ day, slot }) =>
      Slot.findOneAndUpdate(
        { day, slot },
        { day, slot },
        { upsert: true, new: true }
      )
    );
    await Promise.all(promises);

    // ✅ Send Email Notification to OWNER only
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD,
      },
    });

    const message = `
      <h2>Booking Confirmation</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Slots:</strong></p>
      <ul>
        ${selectedSlots.map((s) => `<li>${s.day} - ${s.slot}</li>`).join("")}
      </ul>
    `;

    await transporter.sendMail({
      from: EMAIL_ID,
      to: OWNER_EMAIL,
      subject: "New Slot Booking Confirmation",
      html: message,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
}
module.exports = {
  fetchBookedSlots,
  reserveSlot,
  createOrder,
  getRazorpayKey,
  confirmBooking,
};
