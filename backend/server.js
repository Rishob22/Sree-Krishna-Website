require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();

// CORS Configuration
app.use(
  cors()
);
app.use(express.json());

// Environment Variables
const {
  MONGO_URL,
  PORT,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  EMAIL_ID,
  EMAIL_PASSWORD,
  OWNER_EMAIL,
} = process.env;

// MongoDB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB Schema
const slotSchema = new mongoose.Schema({
  day: String,
  slot: String,
});
const Slot = mongoose.model("Slot", slotSchema);

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Routes

app.get("/booked-slots", async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/reserve-slot", async (req, res) => {
  const { day, slot } = req.body;

  try {
    const existing = await Slot.findOne({ day, slot });
    if (existing) return res.status(409).json({ message: "Already booked" });

    // Dummy frontend hold
    res.json({ day, slot });
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/create-order", async (req, res) => {
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
});

app.get("/get-razorpay-key", (req, res) => {
  res.json({ key: RAZORPAY_KEY_ID });
});

app.post("/confirm-booking", async (req, res) => {
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
});

// Start Server
const serverPort = PORT || 5000;
app.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
});
