const express = require('express');
const router = express.Router();
const Item = require('../models/itemModel');

// Route to get all booked slots
router.get('/booked-slots', async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching booked slots.' });
    }
});

// Route to add an item
router.post('/add-item', async (req, res) => {
    try {
        const { day, slot } = req.body;

        if (!day || slot === undefined) {
            return res.status(400).json({ message: 'Day and slot are required.' });
        }

        const newItem = new Item({ day, slot });
        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

// Export the router
module.exports = router;
