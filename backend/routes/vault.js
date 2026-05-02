const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Friend = require('../models/Friend');
const { protect } = require('../middleware/auth');
const { sendEmergencyAlert } = require('../utils/email');

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/docs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// All routes are protected
router.use(protect);

// GET /api/vault - get all friends (with search)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let query = { owner: req.user._id };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { nickname: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }
    const friends = await Friend.find(query).sort({ name: 1 });
    res.json(friends);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/vault/:id - get single friend
router.get('/:id', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });
    res.json(friend);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/vault - add new friend
router.post('/', async (req, res) => {
  try {
    const friend = await Friend.create({ ...req.body, owner: req.user._id });
    res.status(201).json(friend);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/vault/:id - update friend
router.put('/:id', async (req, res) => {
  try {
    const friend = await Friend.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!friend) return res.status(404).json({ message: 'Friend not found' });
    res.json(friend);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/vault/:id - delete friend
router.delete('/:id', async (req, res) => {
  try {
    const friend = await Friend.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });
    // Clean up documents
    for (const doc of friend.documents) {
      const filePath = path.join(__dirname, '../uploads/docs', doc.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Friend deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/vault/:id/upload - upload PDF document
router.post('/:id/upload', upload.single('document'), async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    friend.documents.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      description: req.body.description || '',
    });
    await friend.save();
    res.json({ message: 'Document uploaded', friend });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/vault/:id/document/:docId - delete specific document
router.delete('/:id/document/:docId', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });

    const doc = friend.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '../uploads/docs', doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    friend.documents.pull(req.params.docId);
    await friend.save();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/vault/:id/emergency - send emergency alert email
router.post('/:id/emergency', async (req, res) => {
  try {
    const friend = await Friend.findOne({ _id: req.params.id, owner: req.user._id });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });

    await sendEmergencyAlert(friend.name, req.user.name, req.user.email);
    res.json({ message: `Emergency alert sent for ${friend.name}!` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
