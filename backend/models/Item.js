const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    day: String,
    slot: String,
    reservedUntil: Date,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
