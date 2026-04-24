const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const detectThreats = require('../services/threatEngine');
const logAction = require('../middleware/audit.middleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    await logAction(req, 'CREATE', 'User registered', 'success');

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (user.isLocked()) {
      return res.status(403).json({ error: 'Account is locked' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      await logAction(req, 'FAILED_LOGIN', 'Wrong password', 'danger');

      await detectThreats({ user, ip: req.ip });

      return res.status(400).json({ error: 'Invalid credentials' });
    }

    await user.resetLoginAttempts();
    user.lastLoginIp = req.ip;
    await user.save();

    await detectThreats({ user, ip: req.ip });
    await logAction(req, 'LOGIN', 'User logged in', 'success');

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};