const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/chat/usermodel");

dotenv.config();

// exports.Auth = async (req, res, next) => {
//     console.log("Request Headers:", req.headers);

//     let token;
    
//     // Extract token from Authorization header
//     if (req.headers.authorization) {
//         const parts = req.headers.authorization.split(" ");
//         if (parts.length === 2 && parts[0] === "Bearer") {
//             token = parts[1];
//         }
//     }

//     console.log("Extracted Token:", token);

//     if (!token) {
//         return res.status(401).json({ message: "Token not provided", error: true });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
//         console.log("Decoded Token:", decoded);

//         const user = await User.findById(decoded.userId);
//         if (!user) {
//             return res.status(401).json({ message: "User not found", error: true });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("JWT Verification Error:", error);
//         return res.status(401).json({ message: "Invalid or expired token", error: true });
//     }
// };

 

// exports.Auth = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract token
//     if (!token) {
//         console.log("No token found in request");
//         return res.status(401).json({ message: "No token provided", success: false });
//     }

//     jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             console.log("Invalid token:", err.message);
//             return res.status(401).json({ message: "Invalid token", success: false });
//         }

//         console.log("Decoded Token:", decoded);
//         req.user = decoded;  // Attach user info
//         next();
//     });
// };



// exports.Auth = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "No token provided", success: false });
//     }

//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             if (err.name === "TokenExpiredError") {
//                 return res.status(401).json({ message: "Token expired, please log in again", success: false });
//             }
//             return res.status(401).json({ message: "Invalid token", success: false });
//         }

//         req.user = { userId: decoded.userId }; // ✅ Ensure correct userId extraction
//         next();
//     });
// };

// ✅ FIXED Auth middleware

exports.Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure the token exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided", success: false });
  }

  const token = authHeader.split(" ")[1]; // Get the token from the header

  try {
    // Decode the token and get the user ID from it
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    // Optionally, fetch the user from the database (to check if the user exists)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Attach the user data to the request object (to be used later in controllers)
    req.user = {
      _id: user._id.toString(),
      username: user.username,
    };

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", success: false });
    }

    return res.status(401).json({ message: "Invalid token", success: false });
  }
};


