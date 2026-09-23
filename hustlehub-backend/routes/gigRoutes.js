const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateGigCreate, validateGigUpdate, validateObjectId } = require('../middleware/validationMiddleware');
const c = require('../controllers/gigController');

router.use(authenticateToken);   // every gig route needs a valid JWT

router.get('/', c.getAllGigs);
router.get('/mine', authorizeRoles('freelancer'), c.getMyGigs);   // MUST be before /:id
router.get('/:id', validateObjectId, c.getGigById);

router.post('/', authorizeRoles('freelancer'), validateGigCreate, c.createGig);
router.put('/:id', authorizeRoles('freelancer'), validateObjectId, validateGigUpdate, c.updateGig);
router.delete('/:id', authorizeRoles('freelancer'), validateObjectId, c.deleteGig);

module.exports = router;
