
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateAccessToken");
const User = require('../../models/chat/usermodel');
const jwt = require("jsonwebtoken");
const uploadImageCloudinary = require('../../utils/cloudinary');
const { generateSuggestedUsernames } = require('../../utils/generateUsername');
const bcrypt = require("bcrypt"); // ✅ Ensure bcrypt is imported


exports.registerUser = async (req, res) => {
    try {
      const { username, email, password, phoneNumber, avatar, bio } = req.body;
  
      if (!username || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: "Provide valid credentials", error: true });
      }
  
      const emailLower = email.toLowerCase();
  
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) return res.status(400).json({ message: "Email already exists", error: true });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        username: username.toLowerCase(),
        email: emailLower,
        password: hashedPassword,
        phoneNumber,
        avatar,
        bio,
        lastSeen: new Date(),
      });
  
      await newUser.save();
  
      // ✅ Generate both tokens
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);
  
      res.json({
        message: "User registered successfully!",
        success: true,
        data: { user: newUser, accessToken, refreshToken },
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Server error", error: true });
    }
  };
  

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) return res.status(400).json({ message: "Provide email and password" });
  
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      user.lastSeen = new Date();
      await user.save();
  
      // ✅ Generate both tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
  
      res.json({ message: "Login successful", accessToken, refreshToken, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error", error: true });
    }
  };
  

  exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN); // 🔥 Fixed typo here!
      const newAccessToken = generateAccessToken(decoded.userId); // Use function for consistency
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  };


exports.logout = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (userId) {
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({ 
            success: true, 
            message: "Logged out successfully" 
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};

// exports.getUserProfile = async (req, res) => {
//     try {
//         // Ensure user is authenticated
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ message: "Unauthorized access", error: true, success: false });
//         }

//         // Fetch user details except password
//         const user = await User.findById(req.user._id).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found", error: true, success: false });
//         }

//         return res.status(200).json({
//             message: "User profile fetched successfully",
//             error: false,
//             success: true,
//             data: user,
//         });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return res.status(500).json({
//             message: error.message || "Internal server error",
//             error: true,
//             success: false,
//         });
//     }
// };

exports.getUserProfile = async (req, res) => {
    try {
        console.log("User ID from token:", req.user);

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }

        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            console.log("User not found in DB");
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};



exports.updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized access", error: true, success: false });
        }

        const { username, bio, avatar } = req.body; // Changed `name` to `username`

        if (!username) {
            return res.status(400).json({ message: "Username is required", success: false });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase() });

        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: "Username already taken. Choose another.", success: false });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { 
                username: username.toLowerCase(), // Ensure the correct field is updated
                bio, 
                avatar 
            },
            { new: true, select: "-password" }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            message: "Profile updated successfully!",
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: error.message, error: true, success: false });
    }
};




exports.uploadAvatarController = async (req, res) => {
    try {
        const user = req.user; 
        const image = req.file; 

        if (!image) {
            return res.status(400).json({ message: "No file uploaded", error: true });
        }

        const upload = await uploadImageCloudinary(image);
        if (!upload || !upload.url) {
            throw new Error("Failed to upload image to Cloudinary");
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { avatar: upload.url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User update failed", error: true });
        }

        return res.json({
            message: "Profile image updated successfully",
            data: { avatar: upload.url },
            success: true,
        });
    } catch (error) {
        console.error("Error in uploadAvatarController:", error);
        return res.status(500).json({ message: error.message, error: true });
    }
}; 

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username: username });

        if (user) {
            const suggestions = generateSuggestedUsernames(username);
            return res.json({ exists: true, suggestions });
        }

        return res.json({ exists: false });
    } catch (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({ message: error.message, error: true });
    }
};



