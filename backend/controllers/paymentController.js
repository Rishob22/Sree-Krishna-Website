const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Item = require('../models/Item');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create order.' });
    }
};

exports.confirmBooking = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, selectedSlots } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const bookingPromises = selectedSlots.map((slot) => new Item({ day: slot.day, slot: slot.slot }).save());
        await Promise.all(bookingPromises);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: process.env.OWNER_EMAIL,
            subject: 'Booking Confirmation',
            text: `The following slots have been successfully booked:\n${selectedSlots.map((slot) => `Day: ${slot.day}, Slot: ${slot.slot}`).join('\n')}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Booking confirmed and email sent!' });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Failed to confirm booking.' });
    }
};
