const errorHandler = (err, req, res, next) => {
    // Log the full error on the server only
    console.error(err);

    // Send a safe, controlled response to the client
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? 'An unexpected error occurred'
                : (err.publicMessage || 'Request failed')
    });
};

module.exports = errorHandler;