const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"]
    }
  }
}));

// Parse JSON requests
app.use(express.json());


// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

app.use('/api', apiLimiter);

// Authentication routes
const authRoutes = require('./routes/authRoutes');

// Error handling
const errorHandler = require('./middleware/errorMiddleware');

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'HustleHub API is running'
    });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

app.use('/api/auth', authLimiter, authRoutes);app.use('/api/gigs', require('./routes/gigRoutes'));
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many booking requests. Please try again later.'
  }
});

app.use('/api/bookings', bookingLimiter, require('./routes/bookingRoutes'));app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    error.publicMessage = 'Route not found';
    next(error);
});

app.use(errorHandler);

module.exports = app;