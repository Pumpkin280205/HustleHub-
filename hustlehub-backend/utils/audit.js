const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const AUDIT_FILE = path.join(__dirname, '..', 'logs', 'audit.log');

function audit(action, { actorId = null, actorRole = null, targetId = null, ip = null, outcome = 'success' } = {}) {
  const entry = {
    time: new Date().toISOString(),
    action,
    actorId,
    actorRole,
    targetId,
    ip,
    outcome,
  };
  fs.appendFile(AUDIT_FILE, JSON.stringify(entry) + '\n', err => {
    if (err) logger.error('Failed to write audit entry', { message: err.message });
  });
  logger.info('AUDIT', { category: 'audit', ...entry });
}

function readAudit(limit = 100) {
  if (!fs.existsSync(AUDIT_FILE)) return [];
  const lines = fs.readFileSync(AUDIT_FILE, 'utf8').trim().split('\n').filter(Boolean);
  return lines.slice(-limit).reverse().map(l => JSON.parse(l));
}

module.exports = { audit, readAudit };