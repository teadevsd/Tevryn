const contactModel = require("../../models/chat/contactModel");
const friendRequestModel = require("../../models/chat/friendRequestModel");
const inviteModel = require("../../models/chat/inviteModel");
const User = require("../../models/chat/usermodel");


exports.fetchContacts = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure req.user is populated via auth middleware
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - User ID not found" });
        }

        const contacts = await contactModel.find({ owner: userId });

        // Get user details for each contact
        const enrichedContacts = await Promise.all(
            contacts.map(async (contact) => {
                const user = await User.findById(contact.contactId);
                return user
                    ? { 
                        id: user._id,
                        username: user.username,
                        avatar: user.avatar,
                        email: user.email,
                        lastSeen: user.lastSeen,
                        isRegistered: true
                      }
                    : { ...contact.toObject(), isRegistered: false };
            })
        );

        res.status(200).json(enrichedContacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Error fetching contacts", error });
    }
};

// ✅ Fetch user's contacts
exports.getAllContacts = async (req, res) => {
  try {
      const { username } = req.query;
      const user = await User.findOne({ username }).populate("contacts");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.contacts);
  } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Server error" });
  }
};

  exports.handleSearch = async (req, res) => {
      try {
          const { query } = req.query;
          const userId = req.user.id;
  
          if (!query) {
              return res.status(400).json({ message: "Search query is required" });
          }
  
          const user = await User.findOne({
              $or: [{ email: query }, { username: query }],
          });
  
          if (user) {
              // Check if the user is already in contacts
              const existingContact = await contactModel.findOne({
                  owner: userId,
                  contactId: user._id,
              });
  
              if (!existingContact) {
                  await Contact.create({
                      owner: userId,
                      contactId: user._id,
                  });
              }
  
              return res.status(200).json({
                  found: true,
                  user: {
                      id: user._id,
                      username: user.username,
                      email: user.email,
                      avatar: user.avatar,
                      bio: user.bio,
                      lastSeen: user.lastSeen,
                  },
              });
          } else {
              return res.status(404).json({
                  found: false,
                  message: "User not found, you can send an invite instead",
              });
          }
      } catch (error) {
          res.status(500).json({ message: "Error searching user", error });
      }
  };

  // Send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
      const { userId } = req.body;
      const senderId = req.user.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Assuming there's a FriendRequest model
      const friendRequest = await friendRequestModel.create({
        sender: senderId,
        receiver: userId,
        status: "pending",
      });
  
      res.status(200).json({ message: "Friend request sent", friendRequest });
    } catch (error) {
      res.status(500).json({ message: "Error sending friend request", error });
    }
  };

  // Send invite to a phone number
exports.sendInvite = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const senderId = req.user.id;
  
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
  
      const inviteExists = await inviteModel.findOne({ phoneNumber });
      if (inviteExists) {
        return res.status(400).json({ message: "Invite already sent" });
      }
  
      const invite = await inviteModel.create({
        phoneNumber,
        sender: senderId,
      });
  
      res.status(200).json({ message: "Invite sent successfully", invite });
    } catch (error) {
      res.status(500).json({ message: "Error sending invite", error });
    }
  };
  