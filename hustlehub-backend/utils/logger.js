const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Keys that must never reach any log
const SENSITIVE = ['password', 'passwordhash', 'token', 'accesstoken', 'refreshtoken',
  'authorization', 'cookie', 'secret', 'jwt', 'cardnumber', 'cvv'];

function redact(value, depth = 0) {
  if (depth > 5 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(v => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = SENSITIVE.includes(k.toLowerCase()) ? '[REDACTED]' : redact(v, depth + 1);
  }
  return out;
}

const redactFormat = winston.format(info => {
  const { level, message, ...meta } = info;
  return Object.assign(info, redact(meta));
});

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
  new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
];

// Cloud logging (only enabled when the env vars exist)
if (process.env.BETTER_STACK_SOURCE_TOKEN && process.env.BETTER_STACK_INGESTING_HOST) {
  const logtail = new Logtail(process.env.BETTER_STACK_SOURCE_TOKEN, {
    endpoint: `https://${process.env.BETTER_STACK_INGESTING_HOST}`,
  });
  transports.push(new LogtailTransport(logtail));
} else {
  console.warn('Better Stack not configured: logging locally only');
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: false }),
    redactFormat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'hustlehub-api' },
  transports,
});

module.exports = logger;