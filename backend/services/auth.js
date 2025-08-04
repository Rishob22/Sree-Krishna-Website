//contains two functions for creating and validating jwt tokens
const jwt = require("jsonwebtoken");
const secret = process.env.USER_PAYLOAD_HASH_SECRET;
//takes the user object and generates the jwt token
async function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = await jwt.sign(payload, secret);
  return token;
}
//accepts the token and return payload
async function validateToken(token) {
  const payload = await jwt.verify(token, secret);
  return payload;
}
module.exports = { createTokenForUser, validateToken };
//the create and validate token are loosely coupled
