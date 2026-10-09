const express = require('express');

const router = express.Router();

const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const {
    validateRegister,
    validateLogin
} = require('../middleware/validationMiddleware');

const {
    loginLimiter,
    registerLimiter
} = require('../middleware/rateLimitMiddleware');

// Registration: limit repeated registration attempts.
router.post('/register', registerLimiter, validateRegister, register);

// Login: limit repeated login attempts.
router.post('/login', loginLimiter, validateLogin, login);

// Protected route: requires a valid authentication token.
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You have accessed a protected route',
        userId: req.user.id
    });
});

module.exports = router;