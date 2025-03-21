const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: "15m" }); // Short-lived
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: "7d" }); // Longer-lived
};
