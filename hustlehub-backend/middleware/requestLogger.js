const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request', {
      category: 'http',
      method: req.method,
      path: req.originalUrl.split('?')[0],
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      userId: req.user ? req.user.id : null,
    });
  });
  next();
};