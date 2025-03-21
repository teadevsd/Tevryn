const express = require('express');
const { Auth } = require('../../middlewares/auth');
const { registerUser, login, logout, getUserProfile, uploadAvatarController, checkUsername, updateUserProfile, refreshToken } = require('../../controllers/chat/userController');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', login);
router.post('/logout', Auth, logout);
router.get('/user-details', Auth, getUserProfile);
router.put('/update-profile', Auth, updateUserProfile);
router.post('/refresh-token', Auth, refreshToken);
router.post('/check-username', Auth, checkUsername);
router.put('/upload-avatar', Auth, upload.single('avatar'), uploadAvatarController);

module.exports = router;
 
