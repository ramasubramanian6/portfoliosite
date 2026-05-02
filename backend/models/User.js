const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ── Auth fields ──────────────────────────────────────────────────────────────
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp:        { type: String },
  otpExpiry:  { type: Date },

  // ── Personal profile ─────────────────────────────────────────────────────────
  phone:       { type: String, trim: true },
  address:     { type: String },
  bloodGroup:  { type: String },
  dateOfBirth: { type: Date },

  // ── Emergency contact (who to email when SOS is sent) ────────────────────────
  emergencyName:  { type: String },
  emergencyPhone: { type: String },
  emergencyEmail: { type: String, lowercase: true, trim: true },

  // ── Profile complete flag (set true once user fills out personal info) ────────
  profileComplete: { type: Boolean, default: false },

  // ── User's own personal documents (PDFs) ─────────────────────────────────────
  documents: [
    {
      filename:     String,
      originalName: String,
      description:  String,
      uploadedAt:   { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
