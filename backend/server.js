require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//Slot model require:

const app = express();
//controllers require
const {
  fetchBookedSlots,
  reserveSlot,
  createOrder,
  getRazorpayKey,
  confirmBooking,
} = require("./controllers/controllers.js");
// CORS Configuration
app.use(cors());
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Environment Variables
const { MONGO_URL, PORT } = process.env;
// MongoDB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/booked-slots", fetchBookedSlots);
app.post("/reserve-slot", reserveSlot);
app.post("/create-order", createOrder);
app.get("/get-razorpay-key", getRazorpayKey);
app.post("/confirm-booking", confirmBooking);
const serverPort = PORT || 5000;
app.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
});
