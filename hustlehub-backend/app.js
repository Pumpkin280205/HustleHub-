const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const { apiLimiter, authLimiter } = require('./middleware/rateLimiters');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Add HTTP security headers, including an explicit Content Security Policy.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"]
        }
    }
}));

// Parse JSON request bodies.
app.use(express.json());

// Configure Cross-Origin Resource Sharing (CORS).
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// General API rate limiting.
app.use('/api', apiLimiter);

// API health check.
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'HustleHub API is running'
    });
});

// Authentication routes, with brute-force rate limiting.
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));

// Other API routes.
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Handle unknown routes.
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    error.publicMessage = 'Route not found';
    next(error);
});

// Centralized error handling.
app.use(errorHandler);

module.exports = app;
