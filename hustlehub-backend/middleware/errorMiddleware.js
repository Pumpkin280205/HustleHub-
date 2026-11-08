const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log on the server only: no stack trace, body, headers or tokens
    const meta = {
        category: 'error',
        message: err.message,
        statusCode,
        method: req.method,
        path: (req.originalUrl || '').split('?')[0],
        ip: req.ip,
        userId: req.user ? req.user.id : null
    };

    if (statusCode >= 500) {
        logger.error('Server error', meta);
    } else {
        logger.warn('Client error', meta);
    }

    // Send a safe, controlled response to the client
    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? 'An unexpected error occurred'
                : (err.publicMessage || 'Request failed')
    });
};

module.exports = errorHandler;