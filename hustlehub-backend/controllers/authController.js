const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role });

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    // password has select:false on the model, so ask for it explicitly
    const user = await User.findOne({ email }).select('+password');

    // Same response for unknown email and wrong password so attackers can't discover accounts
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
