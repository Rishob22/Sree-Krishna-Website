const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/payment.js");
const paymentRoute = express.Router();
paymentRoute.post("/create-order", createOrder);
paymentRoute.post("/verify-payment", verifyPayment);
module.exports = paymentRoute;
