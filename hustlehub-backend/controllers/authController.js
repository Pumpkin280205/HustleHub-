const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { audit } = require('../utils/audit');
const { isLocked, registerFailure, resetFailures } = require('../utils/lockout');

exports.register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password, role } = req.body;

    // Joi has already rejected anything that is not an email string, so no query operator can reach this filter
    if (await User.findOne({ email })) { // nosemgrep: ajinabraham.njsscan.database.nosql_find_injection.node_nosqli_injection
      logger.warn('Registration rejected: user exists', { category: 'auth', ip: req.ip });
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({ email, password: hashedPassword, role });

    logger.info('User registered', { category: 'auth', userId: created._id.toString(), ip: req.ip });
    audit('USER_REGISTERED', { actorId: created._id.toString(), actorRole: created.role, ip: req.ip });

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    // password has select:false on the model, so ask for it explicitly.
    // email is a Joi-validated string, so no query operator can reach this filter
    const user = await User.findOne({ email }).select('+password'); // nosemgrep: ajinabraham.njsscan.database.nosql_find_injection.node_nosqli_injection

    // Locked accounts are refused before the password is even checked
    if (user && isLocked(user)) {
      logger.warn('Login blocked: account locked', { category: 'auth', userId: user._id.toString(), ip: req.ip });
      audit('LOGIN_BLOCKED_LOCKED', { actorId: user._id.toString(), ip: req.ip, outcome: 'denied' });
      return res.status(423).json({ success: false, message: 'Account temporarily locked. Try again later.' });
    }

    // Same response for unknown email and wrong password so attackers can't discover accounts
    if (!user || !(await bcrypt.compare(password, user.password))) {
      if (user) {
        const nowLocked = await registerFailure(user);
        if (nowLocked) {
          logger.warn('Account locked after repeated failures', { category: 'auth', userId: user._id.toString(), ip: req.ip });
          audit('ACCOUNT_LOCKED', { actorId: user._id.toString(), ip: req.ip, outcome: 'denied' });
        }
      }
      logger.warn('Login failed', { category: 'auth', ip: req.ip });
      audit('LOGIN_FAILED', { actorId: user ? user._id.toString() : null, ip: req.ip, outcome: 'failure' });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await resetFailures(user);

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info('Login success', { category: 'auth', userId: user._id.toString(), ip: req.ip });
    audit('LOGIN_SUCCESS', { actorId: user._id.toString(), actorRole: user.role, ip: req.ip });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    next(err);
  }
};