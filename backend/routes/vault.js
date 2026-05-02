const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Friend = require('../models/Friend');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEmergencyAlert } = require('../utils/email');

// ─── Multer Setup — PDF only, max 10MB ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/docs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Use a random prefix to prevent filename guessing
    const randomHex = require('crypto').randomBytes(16).toString('hex');
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${randomHex}-${safe}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ─── All routes require a valid JWT ──────────────────────────────────────────
router.use(protect);

// ─── GET /api/vault — list all contacts (with optional search) ────────────────
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const query = { owner: req.user._id };

    if (q && typeof q === 'string') {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { nickname: { $regex: escaped, $options: 'i' } },
        { phone: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { tags: { $in: [new RegExp(escaped, 'i')] } },
      ];
    }

    const friends = await Friend.find(query).sort({ name: 1 });
    res.json(friends);
  } catch (err) {
    console.error('[vault/GET]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/vault/:id — get single contact ─────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Contact not found' });
    res.json(friend);
  } catch (err) {
    console.error('[vault/GET/:id]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/vault — create new contact ────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    // Whitelist allowed fields — never pass raw req.body directly to create()
    const {
      name, nickname, phone, email, address, bloodGroup,
      dateOfBirth, notes, relationship, emergencyContact, emergencyPhone, tags,
    } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const friend = await Friend.create({
      name, nickname, phone, email, address, bloodGroup,
      dateOfBirth, notes, relationship, emergencyContact, emergencyPhone, tags,
      owner: req.user._id,
    });
    res.status(201).json(friend);
  } catch (err) {
    console.error('[vault/POST]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/vault/:id — update contact ─────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    // Whitelist allowed fields — prevent overwriting owner/documents via req.body
    const {
      name, nickname, phone, email, address, bloodGroup,
      dateOfBirth, notes, relationship, emergencyContact, emergencyPhone, tags,
    } = req.body;

    const allowedUpdates = {
      name, nickname, phone, email, address, bloodGroup,
      dateOfBirth, notes, relationship, emergencyContact, emergencyPhone, tags,
    };

    const friend = await Friend.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      allowedUpdates,
      { new: true, runValidators: true }
    );
    if (!friend) return res.status(404).json({ message: 'Contact not found' });
    res.json(friend);
  } catch (err) {
    console.error('[vault/PUT/:id]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE /api/vault/:id — delete contact + all their documents ─────────────
router.delete('/:id', async (req, res) => {
  try {
    const friend = await Friend.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Contact not found' });

    // Clean up uploaded documents from disk
    for (const doc of friend.documents) {
      // path.basename prevents path traversal
      const filePath = path.join(__dirname, '../uploads/docs', path.basename(doc.filename));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('[vault/DELETE/:id]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/vault/:id/upload — upload PDF document ────────────────────────
router.post('/:id/upload', upload.single('document'), async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Contact not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Sanitize description input
    const description = typeof req.body.description === 'string'
      ? req.body.description.slice(0, 200)
      : '';

    friend.documents.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      description,
    });
    await friend.save();
    res.json({ message: 'Document uploaded successfully', friend });
  } catch (err) {
    console.error('[vault/upload]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE /api/vault/:id/document/:docId — delete specific document ─────────
router.delete('/:id/document/:docId', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Contact not found' });

    const doc = friend.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // path.basename prevents path traversal attacks
    const filePath = path.join(__dirname, '../uploads/docs', path.basename(doc.filename));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    friend.documents.pull(req.params.docId);
    await friend.save();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error('[vault/delete-doc]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/vault/:id/emergency — send emergency alert ────────────────────
router.post('/:id/emergency', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Contact not found' });

    // Load full user profile (emergency contact details, personal info)
    const fullUser = await User.findById(req.user._id).select('-password -otp -otpExpiry');

    // Accept optional location + message from request body
    const location = req.body && req.body.location ? req.body.location : null;
    const message  = req.body && typeof req.body.message === 'string' ? req.body.message.slice(0, 500) : null;

    await sendEmergencyAlert(fullUser, friend.name, location, message);
    res.json({ message: `Emergency alert sent for ${friend.name}!` });
  } catch (err) {
    console.error('[vault/emergency]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
