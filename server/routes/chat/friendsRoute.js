const express = require("express");
const { fetchContacts, handleSearch, sendFriendRequest, sendInvite, getAllContacts } = require("../../controllers/chat/friendsController");
const { Auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/get-contacts", Auth, fetchContacts);
router.get("/search-user", Auth, handleSearch);
router.post("/add-friend", Auth, sendFriendRequest);
router.post("/send-invite", Auth, sendInvite);
router.get("/fetch-all-contacts", Auth, getAllContacts);


module.exports = router;
