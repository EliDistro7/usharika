// ============================================
// 1. PDF Model (models/PDF.js)
// ============================================
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if you have user authentication
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  metadata: {
    width: Number,
    height: Number,
    format: String,
    pages: Number,
    resourceType: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
pdfSchema.index({ fileName: 'text', description: 'text', tags: 'text' });
pdfSchema.index({ createdAt: -1 });
pdfSchema.index({ status: 1 });

module.exports = mongoose.model('PDF', pdfSchema);