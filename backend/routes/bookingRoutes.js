const express = require('express');
const router = express.Router();
const { reserveSlot, getBookedSlots } = require('../controllers/bookingController');

router.post('/reserve-slot', reserveSlot);
router.get('/booked-slots', getBookedSlots);

module.exports = router;
