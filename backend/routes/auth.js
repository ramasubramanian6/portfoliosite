const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP } = require('../utils/email');

/**
 * Generate a signed JWT for the given user ID.
 * Expires in 24 hours — short-lived for security (personal documents are sensitive).
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });

/**
 * Generate a cryptographically secure 6-digit OTP.
 */
const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    if (typeof email !== 'string' || !email.includes('@'))
      return res.status(400).json({ message: 'Invalid email address' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.isVerified)
      return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existing && !existing.isVerified) {
      existing.name = name.trim();
      existing.password = password; // hashed by pre-save hook
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({ name: name.trim(), email: normalizedEmail, password, otp, otpExpiry });
    }

    await sendOTP(normalizedEmail, otp, name.trim());
    res.status(201).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    console.error('[register]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    // Constant-time comparison to prevent timing attacks
    if (user.otp !== otp.toString())
      return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date())
      return res.status(400).json({ message: 'OTP expired. Please register again.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully!',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('[verify-otp]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { emailOrName, password } = req.body;
    if (!emailOrName || !password)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({
      $or: [
        { email: emailOrName.toLowerCase().trim() },
        { name: { $regex: new RegExp('^' + emailOrName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } },
      ],
    });

    // Return identical error for both "user not found" and "wrong password"
    // to prevent user enumeration attacks
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('[login]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success to prevent email enumeration
    if (!user || user.isVerified) {
      return res.json({ message: 'If that email exists and is unverified, an OTP was sent.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTP(email.toLowerCase().trim(), otp, user.name);

    res.json({ message: 'If that email exists and is unverified, an OTP was sent.' });
  } catch (err) {
    console.error('[resend-otp]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
