const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const {
validateBookingCreate,
validateObjectId
} = require('../middleware/validationMiddleware');

const { bookingLimiter } = require('../middleware/rateLimitMiddleware');
const c = require('../controllers/bookingController');

// All booking routes require authentication.
router.use(authenticateToken);

// Only clients can create bookings.
router.post(
'/',
bookingLimiter,
authorizeRoles('client'),
validateBookingCreate,
c.createBooking
);

// Keep /mine before /:id.
router.get('/mine', c.getMyBookings);

// Get a specific booking by ID.
router.get('/:id', validateObjectId, c.getBookingById);

module.exports = router;