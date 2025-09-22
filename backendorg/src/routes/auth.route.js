const express = require('express');
const router = express.Router();
const { registerUser, loginUser , getCurrentUser ,logoutUser} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth'); // <-- destructure
// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.get('/logout', protect, logoutUser);
module.exports = router;
