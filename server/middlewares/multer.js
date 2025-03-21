const multer = require("multer");

// ✅ Use memory storage or disk storage
const storage = multer.memoryStorage(); // Stores files in memory (useful for Cloud storage)
const upload = multer({ storage });

module.exports = upload; // ✅ Export properly
