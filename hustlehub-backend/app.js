const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    error.publicMessage = 'Route not found';
    next(error);
}); 

app.use(errorHandler);

module.exports = app;