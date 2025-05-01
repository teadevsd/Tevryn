// In your videoRoute.js
const express = require('express');
const router = express.Router();
const generateToken = require('../../controllers/conference/videoToken');
const { Auth } = require('../../middlewares/auth');


router.get('/generate-token', Auth, async (req, res) => {
  try {
    const token = await generateToken(req.user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Token generation failed' });
  }
});

module.exports = router;