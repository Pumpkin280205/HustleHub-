const express = require('express');

const router = express.Router();

const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const {
    validateRegister,
    validateLogin
} = require('../middleware/validationMiddleware');

// Both routes are rate limited by authLimiter in app.js (failed attempts only).
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected route: requires a valid authentication token.
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You have accessed a protected route',
        userId: req.user.id
    });
});

module.exports = router;