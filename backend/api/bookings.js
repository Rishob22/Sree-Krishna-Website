const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');

// Route to reserve a slot
router.post('/reserve-slot', async (req, res) => {
    try {
        const { day, slot, duration } = req.body;

        const existingItem = await Item.findOne({
            day,
            slot,
            $or: [
                { reservedUntil: { $gte: new Date() } }, // Already booked
                { reservedUntil: null },                // Fully booked
            ],
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Slot is already booked or reserved.' });
        }

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

// Export the router
module.exports = router;
