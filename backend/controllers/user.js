const { User } = require("../models/user.js");
const { createTokenForUser } = require("../services/auth.js");

async function handleSigninPost(req, res) {
  console.log("login controller reached");
  const { email, password } = req.body;

  const token = await User.matchPasswordAndGenerateToken(email, password);
  if (token) {
    console.log("Token generated");
    const user = await User.findOne({ email }).select("-password"); // exclude password

    const token = await createTokenForUser(user); // uses your clean JWT service

    res
      .status(201)
      .cookie("signedin_token", token, {
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "Login successful",
      });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Incorrect email or password" });
  }
}

async function handleSignupPost(req, res) {
  console.log("reached controller");
  const { name, email, password } = req.body;
  try {
    const obj = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ status: "failure" });
  }
}

async function handleLogout(req, res) {
  res.clearCookie("signedin_token");
  res.status(200).json({ message: "Logged out" });
}

// ✅ NEW: Return logged-in user's details from JWT (already decoded in middleware)
async function handleUserMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profileImageUrl: req.user.profileImageUrl,
      role: req.user.role,
    },
  });
}

module.exports = {
  handleSigninPost,
  handleSignupPost,
  handleLogout,
  handleUserMe,
};
