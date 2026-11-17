// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register new user (assistant or client)
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    let { name, email, password, role, linkedEmail } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    name = name.trim();

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required' });
    }
    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const pwRegex = /^(?=.*[0-9]).{8,}$/;
    if (!pwRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and contain at least one number',
      });
    }

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    const normalizedRole = role.toLowerCase().trim();
    if (!['assistant', 'client'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role – must be assistant or client' });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: 'This email is already registered. Please sign in.',
        alreadyExists: true,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      passwordHash,
      role: normalizedRole,
      onboarded: false,
    });

    // Linking with counterpart (optional)
    if (linkedEmail && linkedEmail.trim()) {
      const cleanLinked = linkedEmail.trim().toLowerCase();
      const linkedUser = await User.findOne({ email: cleanLinked });
      if (linkedUser) {
        if (normalizedRole === 'assistant') {
          user.clientId = linkedUser._id;
          linkedUser.assistantId = user._id;
          await linkedUser.save();
        } else {
          user.assistantId = linkedUser._id;
          linkedUser.clientId = user._id;
          await linkedUser.save();
        }
      }
    }

    await user.save();
    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboarded: user.onboarded,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This email is already registered. Please sign in.',
        alreadyExists: true,
      });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboarded: user.onboarded,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.me = async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    clientId: user.clientId,
    assistantId: user.assistantId,
    onboarded: user.onboarded,
  });
};
