const User = require("../../models/chat/usermodel");
const noteModel = require("../../models/note/noteModel");

exports.addNote = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized", error: true });
        }

        const { title, content, tags } = req.body;

        const newNote = new noteModel({
            userId: req.user.userId,  // ✅ Ensure correct userId is saved
            title,
            content,
            tags,
        });

        await newNote.save();

        return res.status(201).json({
            message: "Note saved successfully",
            error: false,
            success: true,
            data: newNote,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error", error: true });
    }
};

exports.editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;

    if (!req.user || !req.user.userId) {  // ✅ Fixed userId reference
        return res.status(401).json({ message: "Unauthorized", error: true, success: false });
    }

    try {
        const note = await noteModel.findOne({ _id: noteId, userId: req.user.userId });

        if (!note) {
            return res.status(404).json({ message: "Note not found", error: true, success: false });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (typeof isPinned !== "undefined") note.isPinned = isPinned;

        await note.save();

        return res.status(200).json({ message: "Note updated successfully", data: note, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error", error: true, success: false });
    }
};

exports.getNotes = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized", error: true, success: false });
    }

    try {
        const { search } = req.query;
        const query = { userId: req.user.userId };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
                { content: { $regex: search, $options: "i" } }, // Case-insensitive search in content
                { tags: { $regex: search, $options: "i" } }, // Search within tags
                { date: { $regex: search, $options: "i" } }, // If dates are stored as strings
            ];
        }

        const notes = await noteModel.find(query).sort({ isPinned: -1 });

        return res.status(200).json({
            message: "Notes fetched successfully",
            error: false,
            success: true,
            data: notes,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error", error: true, success: false });
    }
};


exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;

        if (!req.user || !req.user.userId) {  // ✅ Fixed userId reference
            return res.status(401).json({ message: "Unauthorized", error: true, success: false });
        }

        const note = await noteModel.findOne({ _id: noteId, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found", error: true, success: false });
        }

        await note.deleteOne();

        return res.status(200).json({ message: "Note deleted successfully", error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error", error: true, success: false });
    }
};

exports.updateNote = async (req, res) => {
    try {
        console.log("Received noteId:", req.params.noteId); // ✅ Debugging log
        const noteId = req.params.noteId;
        const { isPinned } = req.body;

        if (!req.user || !req.user.userId) {  
            console.error("User authentication failed. No userId found in request.");
            return res.status(401).json({ message: "Unauthorized", error: true, success: false });
        }

        console.log("Authenticated User ID:", req.user.userId); // ✅ Debugging log

        const note = await noteModel.findOne({ _id: noteId, userId: req.user.userId });
        if (!note) {
            console.error("Note not found or does not belong to the user.");
            return res.status(404).json({ message: "Note not found", error: true, success: false });
        }

        note.isPinned = isPinned;
        await note.save();

        console.log("Note updated successfully:", note);

        return res.status(200).json({ message: "Note updated successfully", error: false, success: true });
    } catch (error) {
        console.error("Error updating note:", error.message);
        return res.status(500).json({ message: error.message || "Internal server error", error: true, success: false });
    }
};





