
const rateLimit = require('express-rate-limit');

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const createLimiter = ({ max, message, ...options }) => rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message },
    ...options
});

const apiLimiter = createLimiter({
    max: Number(process.env.API_RATE_LIMIT) || 300,
    message: 'Too many requests. Please try again in 15 minutes.'
});

const authLimiter = createLimiter({
    max: Number(process.env.AUTH_RATE_LIMIT) || 10,
    skipSuccessfulRequests: true,
    message: 'Too many failed attempts. Please try again in 15 minutes.'
});

const bookingLimiter = createLimiter({
    max: Number(process.env.BOOKING_RATE_LIMIT) || 20,
    keyGenerator: (req) => req.user.id,
    message: 'Too many booking requests. Please try again in 15 minutes.'
});

module.exports = { apiLimiter, authLimiter, bookingLimiter };
