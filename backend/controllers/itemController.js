const Item = require('../models/Item');

exports.addItem = async (req, res) => {
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
};
