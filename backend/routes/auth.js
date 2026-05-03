const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTP } = require('../utils/email');
const { protect } = require('../middleware/auth');

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
      user: { id: user._id, name: user.name, email: user.email, profileComplete: user.profileComplete },
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

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, profileComplete: user.profileComplete },
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

// ─── GET /api/auth/profile — get current user profile ────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[profile/GET]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/auth/profile — update personal info + emergency contact ─────────
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name, phone, address, bloodGroup, dateOfBirth,
      emergencyName, emergencyPhone, emergencyEmail,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name)           user.name           = name.trim();
    if (phone !== undefined)         user.phone           = phone;
    if (address !== undefined)       user.address         = address;
    if (bloodGroup !== undefined)    user.bloodGroup      = bloodGroup;
    if (dateOfBirth !== undefined)   user.dateOfBirth     = dateOfBirth || null;
    if (emergencyName !== undefined) user.emergencyName   = emergencyName;
    if (emergencyPhone !== undefined)user.emergencyPhone  = emergencyPhone;
    if (emergencyEmail !== undefined)user.emergencyEmail  = emergencyEmail ? emergencyEmail.toLowerCase().trim() : '';

    // Mark profile as complete if all key fields are filled
    if (user.phone && user.emergencyName && user.emergencyPhone) {
      user.profileComplete = true;
    }

    await user.save();
    const updated = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    res.json(updated);
  } catch (err) {
    console.error('[profile/PUT]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Multer setup for user personal documents ─────────────────────────────────
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/user-docs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const randomHex = require('crypto').randomBytes(16).toString('hex');
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${randomHex}-${safe}`);
  },
});

const userUpload = multer({
  storage: docStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ─── POST /api/auth/profile/documents — upload user personal PDF ──────────────
router.post('/profile/documents', protect, userUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const description = typeof req.body.description === 'string' ? req.body.description.slice(0, 200) : '';
    const user = await User.findById(req.user._id);
    user.documents.push({ filename: req.file.filename, originalName: req.file.originalname, description });
    await user.save();
    const updated = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    res.json({ message: 'Document uploaded', user: updated });
  } catch (err) {
    console.error('[profile/docs/upload]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE /api/auth/profile/documents/:docId ────────────────────────────────
router.delete('/profile/documents/:docId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const doc = user.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '../uploads/user-docs', path.basename(doc.filename));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    user.documents.pull(req.params.docId);
    await user.save();
    const updated = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    res.json({ message: 'Document deleted', user: updated });
  } catch (err) {
    console.error('[profile/docs/delete]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/auth/profile/documents/:filename — serve user doc (JWT-protected)
router.get('/profile/documents/:filename', protect, (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, '../uploads/user-docs', filename);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).json({ message: 'Document not found' });
  });
});

// ─── POST /api/auth/vault-pin/set — set / update document vault PIN ───────────
router.post('/vault-pin/set', protect, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || !/^\d{4}$/.test(String(pin)))
      return res.status(400).json({ message: 'PIN must be exactly 4 digits' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.vaultPin = await bcrypt.hash(String(pin), 10);
    await user.save();
    res.json({ message: 'Vault PIN set successfully' });
  } catch (err) {
    console.error('[vault-pin/set]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/vault-pin/verify — verify PIN before showing documents ────
router.post('/vault-pin/verify', protect, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ message: 'PIN is required' });

    const user = await User.findById(req.user._id).select('+vaultPin');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.vaultPin) return res.status(400).json({ message: 'No PIN set yet' });

    const match = await bcrypt.compare(String(pin), user.vaultPin);
    if (!match) return res.status(401).json({ message: 'Incorrect PIN' });
    res.json({ message: 'PIN verified' });
  } catch (err) {
    console.error('[vault-pin/verify]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/vault-pin/reset-request ──────────────────────────────────
router.post('/vault-pin/reset-request', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    await sendOTP(user.email, otp, user.name, 'Vault PIN Reset');
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('[vault-pin/reset-request]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/vault-pin/reset-confirm ──────────────────────────────────
router.post('/vault-pin/reset-confirm', protect, async (req, res) => {
  try {
    const { otp, newPin } = req.body;
    if (!otp || !newPin || !/^\d{4}$/.test(String(newPin)))
      return res.status(400).json({ message: 'OTP and valid 4-digit PIN are required' });

    const user = await User.findById(req.user._id);
    if (user.otp !== otp || user.otpExpiry < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.vaultPin = await bcrypt.hash(String(newPin), 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Vault PIN reset successfully' });
  } catch (err) {
    console.error('[vault-pin/reset-confirm]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
