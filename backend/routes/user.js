const express = require("express");
const {
  handleSigninPost,
  handleSignupPost,
  handleLogout,
  handleUserMe,
} = require("../controllers/user.js");

const userRoute = express.Router();

userRoute.post("/signup", handleSignupPost);
userRoute.post("/signin", handleSigninPost);
userRoute.get("/logout", handleLogout);

// ✅ NEW: fetch current user
userRoute.get("/me", handleUserMe);

module.exports = userRoute;
