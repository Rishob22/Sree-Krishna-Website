const express = require('express');
const router = express.Router();
const { createOrder, confirmBooking } = require('../../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/confirm-booking', confirmBooking);

module.exports = router;
