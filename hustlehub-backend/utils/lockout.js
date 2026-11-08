const User = require('../models/User');

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

function isLocked(user) {
  return Boolean(user.lockUntil && user.lockUntil > new Date());
}

// Returns true if this failure just locked the account
async function registerFailure(user) {
  const attempts = (user.failedAttempts || 0) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    await User.updateOne(
      { _id: user._id },
      { $set: { failedAttempts: 0, lockUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000) } }
    );
    return true;
  }
  await User.updateOne({ _id: user._id }, { $set: { failedAttempts: attempts } });
  return false;
}

async function resetFailures(user) {
  if (user.failedAttempts || user.lockUntil) {
    await User.updateOne({ _id: user._id }, { $set: { failedAttempts: 0, lockUntil: null } });
  }
}

module.exports = { isLocked, registerFailure, resetFailures };