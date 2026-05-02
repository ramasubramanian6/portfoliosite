const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  nickname: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String },
  bloodGroup: { type: String },
  dateOfBirth: { type: Date },
  notes: { type: String },
  relationship: { type: String, default: 'Friend' },
  // Emergency contact info
  emergencyContact: { type: String },
  emergencyPhone: { type: String },
  // Documents (PDF paths)
  documents: [
    {
      filename: String,
      originalName: String,
      uploadedAt: { type: Date, default: Date.now },
      description: String,
    }
  ],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Friend', friendSchema);
