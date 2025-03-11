const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const cors = require("cors");

app.use(cors({
  origin: "https://sree-krishna-website.vercel.app", // Your frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json()); // Middleware to parse JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema and model for items
const itemSchema = new mongoose.Schema({
    day: String,
    slot: String,
    reservedUntil: Date,
});
const Item = mongoose.model('Item', itemSchema);

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Secret
});

// Route to reserve a slot
app.post('/reserve-slot', async (req, res) => {
    try {
        const { day, slot, duration } = req.body; // duration in minutes

        // Check if the slot is already booked or reserved
        const existingItem = await Item.findOne({
            day,
            slot,
            $or: [
                { reservedUntil: { $gte: new Date() } }, // Active reservation
                { reservedUntil: null }, // Fully booked
            ],
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Slot is already booked or reserved.' });
        }

        // Reserve the slot
        const reservedUntil = new Date();
        reservedUntil.setMinutes(reservedUntil.getMinutes() + duration);

        const reservedItem = new Item({ day, slot, reservedUntil });
        await reservedItem.save();

        res.status(200).json(reservedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reserve slot.' });
    }
});

// Route to get all booked slots
app.get('/booked-slots', async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching booked slots.' });
    }
});

// Route to add an item
app.post('/add-item', async (req, res) => {
    try {
        const { day, slot } = req.body;

        // Validate input
        if (!day || slot === undefined) {
            return res.status(400).json({ message: 'Day and slot are required.' });
        }

        // Save the item to the database
        const newItem = new Item({ day, slot });
        await newItem.save();

        res.status(201).json(newItem); // Send back the saved item
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR (without decimal, e.g., 500 for Rs. 500)

        const options = {
            amount: amount * 100, // Convert to paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create order.' });
    }
});

// Route to confirm booking and send confirmation email
app.post('/confirm-booking', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, selectedSlots } = req.body;

        // Verify Razorpay signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Save slots to the database
        const bookingPromises = selectedSlots.map((slot) => new Item({ day: slot.day, slot: slot.slot }).save());
        await Promise.all(bookingPromises);

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID, // Email ID used to send the email
                pass: process.env.EMAIL_PASSWORD, // Email password or app-specific password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: process.env.OWNER_EMAIL, // Owner's email address
            subject: 'Booking Confirmation',
            text: `The following slots have been successfully booked:\n${selectedSlots
                .map((slot) => `Day: ${slot.day}, Slot: ${slot.slot}`)
                .join('\n')}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Booking confirmed and email sent!' });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Sorry!Failed to confirm booking.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
});