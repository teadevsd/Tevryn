const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.generateRefreshToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: "1h" });
    console.log("Generated Token:", token); // Log token for debugging
    return token;
};