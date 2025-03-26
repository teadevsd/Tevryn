const express = require("express");
const { addNote, editNote, getNotes, deleteNote , updateNote} = require("../../controllers/note/NoteController");
const { Auth } = require("../../middlewares/auth");

const router = express.Router();

router.post('/add-note', Auth, addNote);
router.put('/edit-note/:noteId', Auth, editNote);
router.get('/get-note', Auth, getNotes);
router.put('/update-note/:noteId', Auth, updateNote);

router.delete('/delete-note/:noteId', Auth, deleteNote);

module.exports = router;