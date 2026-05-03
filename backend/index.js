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
    
    // Allow any localhost origin in development or if explicitly allowed
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (isLocal || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn('[CORS] Blocked:', origin);
    callback(new Error('CORS blocked'));
  },
  credentials: true,
}));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Global Rate Limiter (DDoS protection) ───────────────────────────────────
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many requests, please try again later.' },
// });
// app.use(globalLimiter);

// ─── Strict Rate Limiter for Auth endpoints ───────────────────────────────────
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20, // max 20 auth attempts per 15 min per IP
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many authentication attempts. Please wait 15 minutes.' },
// });

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/debug', (req, res) => res.json({ message: 'API is working' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vault', require('./routes/vault'));

// ─── Health check (no sensitive info exposed) ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── 404 Handler with logging ────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(' [404]', req.method, req.url);
  res.status(404).json({ message: `Route ${req.url} not found` });
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
