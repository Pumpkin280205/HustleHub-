const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const c = require('../controllers/incomeController');

router.use(authenticateToken, authorizeRoles('freelancer'));
router.get('/', c.getIncomeSummary);

module.exports = router;
