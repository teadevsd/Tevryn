exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
  
    // Generate file URL (adjust path if needed)
    const fileUrl = `/uploads/${req.file.filename}`;
  
    res.status(200).json({ fileUrl });
  };
  