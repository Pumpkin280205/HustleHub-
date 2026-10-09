
const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');
const c = require('../controllers/adminController');

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/users', c.getAllUsers);
router.delete('/gigs/:id', validateObjectId, c.deleteAnyGig);

module.exports = router;
