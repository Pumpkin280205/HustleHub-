const bcrypt = require('bcrypt');
const { findUserByEmail, addUser } = require('../models/userStore');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    addUser({ email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // TODO (Sayali): generate JWT here with jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    // and include it in the response below, e.g. { message, email, token }
    return res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (err) {
    // TODO (Iqra): standardise this error response per Req 8 — no stack traces, consistent shape across all routes
    return res.status(500).json({ message: 'Something went wrong' });
  }
};