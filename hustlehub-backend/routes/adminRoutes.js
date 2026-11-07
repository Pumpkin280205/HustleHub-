
const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');
const { readAudit } = require('../utils/audit');


router.use(authenticateToken, authorizeRoles('admin'));

router.get('/users', c.getAllUsers);
router.delete('/gigs/:id', validateObjectId, c.deleteAnyGig);
router.get('/audit', (req, res) => {
    res.status(200).json({ success: true, entries: readAudit(100) });
});

module.exports = router;
