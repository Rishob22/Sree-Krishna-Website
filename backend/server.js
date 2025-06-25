require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const {
  MONGO_URL,
  PORT,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  EMAIL_ID,
  EMAIL_PASSWORD,
  OWNER_EMAIL,
} = process.env;

// MongoDB model
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const slotSchema = new mongoose.Schema({
  day: String,
  slot: String,
});

const Slot = mongoose.model("Slot", slotSchema);

// Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Routes

app.get("/booked-slots", async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
});

app.post("/reserve-slot", async (req, res) => {
  const { day, slot, duration } = req.body;

  const existing = await Slot.findOne({ day, slot });
  if (existing) return res.status(409).json({ message: "Already booked" });

  // Dummy reserve (not DB saved, only held on frontend for X minutes)
  res.json({ day, slot });
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
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

app.get("/get-razorpay-key", (req, res) => {
  res.json({ key: RAZORPAY_KEY_ID });
});

app.post("/confirm-booking", async (req, res) => {
  const { selectedSlots, name, phone } = req.body;

  try {
    const promises = selectedSlots.map(({ day, slot }) =>
      Slot.findOneAndUpdate(
        { day, slot },
        { day, slot },
        { upsert: true, new: true }
      )
    );
    await Promise.all(promises);

    // Send Email
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
      to: [phone + "@example.com", OWNER_EMAIL],
      subject: "New Slot Booking Confirmation",
      html: message,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
