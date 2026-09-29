const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const c = require('../controllers/transactionController');

router.use(authenticateToken);
router.get('/mine', c.getMyTransactions);

module.exports = router;
