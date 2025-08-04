const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/auth.js");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const buf = randomBytes(16).toString("hex");
  const hmac = createHmac("sha256", buf).update(this.password).digest("hex");

  this.salt = buf;
  this.password = hmac;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken", //takes the email and the password and returns a token for staying logged in if the password is correct
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return null;

    const hashEnteredPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashEnteredPassword != user.password) return null;
    const token = createTokenForUser({
      _id: user._id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    });
    return token;
  }
);

const User = model("User", userSchema);

module.exports = { User };
