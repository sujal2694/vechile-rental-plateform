const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile); // Get user profile
router.put('/profile', authMiddleware, updateUserProfile); // Update user profile

module.exports = router;