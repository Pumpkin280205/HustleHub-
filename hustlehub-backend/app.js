const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const app = express();

// Add common HTTP security headers.
app.use(helmet());

// Parse JSON request bodies.
app.use(express.json());

// Configure Cross-Origin Resource Sharing (CORS).
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes and middleware.
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');



// API health check.
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HustleHub API is running'
  });
});

// Apply separate rate limits to login and registration.
app.use('/api/auth', authRoutes);

// Other API routes.
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));

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