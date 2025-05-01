// // controllers/conference/videoToken.js
// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

// const generateToken = (userId) => {
//   const payload = {
//     user_id: userId, // ✅ This must match the user.id in connectUser()
//     exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
//   };

//   return jwt.sign(payload, process.env.STREAM_API_SECRET, { algorithm: "HS256" });
// };

// module.exports = generateToken;


// In your videoToken.js controller
// controllers/videoToken.js
// const { StreamVideo } = require('@stream-io/video-server-sdk');

exports.generateToken = async (req, res) => {
  try {
    const serverClient = new StreamVideo(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );
    
    const token = serverClient.createToken(req.user._id); // From your auth middleware
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Token generation failed' });
  }
};
