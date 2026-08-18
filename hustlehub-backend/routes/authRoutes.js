const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);// TODO (Iqra): insert emailValidator, passwordValidator here
router.post('/login', login);// TODO (Iqra): insert validators here

module.exports = router; 