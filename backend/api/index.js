const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');
const itemRoutes = require('./routes/itemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: "https://sree-krishna-website.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/payments', paymentRoutes);

//  Export the app for Vercel (instead of app.listen)
module.exports = app;
