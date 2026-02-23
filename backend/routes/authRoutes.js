const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getDoctors,
    updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/doctors', protect, getDoctors);
router.put('/profile', protect, updateProfile);

module.exports = router;
