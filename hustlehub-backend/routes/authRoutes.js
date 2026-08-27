const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const {
    registerValidation,
    loginValidation,
    validateRequest
} = require('../middleware/validationMiddleware');

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

module.exports = router; 