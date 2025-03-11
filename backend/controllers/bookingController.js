const Item = require('../models/Item');

exports.reserveSlot = async (req, res) => {
    try {
        const { day, slot, duration } = req.body;

        const existingItem = await Item.findOne({
            day,
            slot,
            $or: [
                { reservedUntil: { $gte: new Date() } },
                { reservedUntil: null },
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
};

exports.getBookedSlots = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching booked slots.' });
    }
};
