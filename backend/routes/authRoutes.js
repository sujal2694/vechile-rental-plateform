const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Register new user
router.post('/login', login); // Login user
router.get('/profile', authMiddleware, getProfile); // Get user profile (protected)

module.exports = router;