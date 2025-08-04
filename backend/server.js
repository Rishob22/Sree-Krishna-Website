require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication.js");
const { createOrder, verifyPayment } = require("./controllers/payment.js");
const allowedOrigins = [
  "http://localhost:3000",
  "https://sree-krishna-website.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("signedin_token")); //you just pass the name that you have assigned to the token cookie here
//routes
const userRoute = require("./routes/user.js");
const paymentRoute = require("./routes/payment.js");
const slotRoute = require("./routes/slot.js");
app.use("/user", userRoute);
app.use("/payment", paymentRoute);
app.use("/slot", slotRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
