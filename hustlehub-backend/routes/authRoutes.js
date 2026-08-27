const express = require('express');

const router = express.Router();

const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'You have accessed a protected route',
    userId: req.user.id
  });
});

module.exports = router;