const { rateLimit } = require('express-rate-limit');

// Login: 5 requests per IP address every 15 minutes.
const loginLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
limit: 5,
standardHeaders: true,
legacyHeaders: false,
message: {
success: false,
message: 'Too many login attempts. Please try again in 15 minutes.'
}
});

// Registration: 10 requests per IP address every hour.
const registerLimiter = rateLimit({
windowMs: 60 * 60 * 1000,
limit: 10,
standardHeaders: true,
legacyHeaders: false,
message: {
success: false,
message: 'Too many registration attempts. Please try again later.'
}
});

// Booking creation: 10 requests per IP address every 15 minutes.
const bookingLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
limit: 10,
standardHeaders: true,
legacyHeaders: false,
message: {
success: false,
message: 'Too many booking requests. Please try again in 15 minutes.'
}
});

module.exports = {
loginLimiter,
registerLimiter,
bookingLimiter
};