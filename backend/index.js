const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// ─── Security Headers (helmet) ───────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://ramasubramanian.in',
  'https://www.ramasubramanian.in',
  'https://ramasubramanian-a1078.web.app',
  'https://ramasubramanian-a1078.firebaseapp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('CORS blocked'));
  },
  credentials: true,
}));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Global Rate Limiter (DDoS protection) ───────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ─── Strict Rate Limiter for Auth endpoints ───────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 auth attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please wait 15 minutes.' },
});

// ─── Protected Document Serving ───────────────────────────────────────────────
// Documents are NOT served via a public static route.
// JWT is required — accepted from Authorization header OR ?token= query param
// (query param is needed when opening a PDF in a new browser tab).
app.get('/api/vault/document/:filename', (req, res, next) => {
  // Accept token from header or query string
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }

  // Sanitize filename — prevent path traversal attacks
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'uploads', 'docs', filename);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).json({ message: 'Document not found' });
  });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/vault', require('./routes/vault'));

// ─── Health check (no sensitive info exposed) ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Global Error Handler (no stack traces in production) ────────────────────
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Internal server error',
  });
});

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
