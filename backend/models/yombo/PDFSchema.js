// ============================================
// PDF Model (models/yombo/PDFSchema.js)
// Updated to match frontend expectations
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
    required: true,
    default: 0
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
    default: 'application/pdf',
    enum: ['application/pdf', 'text/html', 'text/markdown']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if you have user authentication
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'tangazo',
    enum: [
      'tangazo',    // Matangazo
      'fomu',       // Fomu
      'barua',      // Barua Rasmi
      'taarifa',    // Taarifa
      'matukio',    // Matukio
      'ibada',      // Ratiba za Ibada
      'mafundisho'       // Elimu ya Dini
    ]
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
    type: mongoose.Schema.Types.Mixed,
    default: {}
    // Can contain:
    // - content: String (for rich text/HTML content)
    // - width: Number
    // - height: Number
    // - format: String
    // - pages: Number
    // - resourceType: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
pdfSchema.index({ fileName: 'text', description: 'text', tags: 'text' });
pdfSchema.index({ createdAt: -1 });
pdfSchema.index({ status: 1 });
pdfSchema.index({ category: 1 });
pdfSchema.index({ cloudinaryPublicId: 1 });

// Virtual for checking if it's a rich text document
pdfSchema.virtual('isRichText').get(function() {
  return this.mimeType === 'text/html' || this.mimeType === 'text/markdown';
});

// Method to increment view count
pdfSchema.methods.incrementView = async function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment download count
pdfSchema.methods.incrementDownload = async function() {
  this.downloadCount += 1;
  return this.save();
};

// Static method to get statistics
pdfSchema.statics.getStats = async function() {
  const totalPDFs = await this.countDocuments({ status: 'active' });
  
  const aggregateResults = await this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$fileSize' },
        totalDownloads: { $sum: '$downloadCount' },
        totalViews: { $sum: '$viewCount' }
      }
    }
  ]);

  const categoryStats = await this.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const recentUploads = await this.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('fileName fileSize createdAt category');

  return {
    totalPDFs,
    totalSize: aggregateResults[0]?.totalSize || 0,
    totalDownloads: aggregateResults[0]?.totalDownloads || 0,
    totalViews: aggregateResults[0]?.totalViews || 0,
    categoryStats,
    recentUploads
  };
};

module.exports = mongoose.model('PDF', pdfSchema);