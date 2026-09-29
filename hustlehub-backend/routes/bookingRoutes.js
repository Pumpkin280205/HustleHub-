const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateBookingCreate, validateObjectId } = require('../middleware/validationMiddleware');
const c = require('../controllers/bookingController');

router.use(authenticateToken);

router.post('/', authorizeRoles('client'), validateBookingCreate, c.createBooking);
router.get('/mine', c.getMyBookings);                     // MUST be before /:id
router.get('/:id', validateObjectId, c.getBookingById);

module.exports = router;
