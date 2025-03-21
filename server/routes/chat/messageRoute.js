
const { Auth } = require("../../middlewares/auth");
const express = require("express");


const { getMessages, saveMessage } = require("../../controllers/chat/messageController");

const router = express.Router();

router.get("/get-messages", Auth, getMessages);
router.post("/save-message", Auth, saveMessage);



module.exports = router;
