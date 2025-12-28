// ============================================
// PDF Controller (controllers/pdfController.js)
// Updated to match frontend expectations
// ============================================
const PDF = require('../models/yombo/PDFSchema');
const cloudinary = require('../config/cloudinary');

// Upload PDF (save metadata to database)
exports.uploadPDF = async (req, res) => {
  try {
    const {
      fileName,
      fileSize,
      cloudinaryUrl,
      cloudinaryPublicId,
      mimeType,
      description,
      tags,
      category,
      metadata
    } = req.body;

    // Validate required fields
    if (!fileName || !cloudinaryUrl || !cloudinaryPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fileName, cloudinaryUrl, cloudinaryPublicId'
      });
    }

    // Check if PDF already exists
    const existingPDF = await PDF.findOne({ cloudinaryPublicId });
    if (existingPDF) {
      return res.status(409).json({
        success: false,
        message: 'PDF already exists',
        data: existingPDF
      });
    }

    // Create new PDF document
    const newPDF = new PDF({
      fileName,
      fileSize: fileSize || 0,
      cloudinaryUrl,
      cloudinaryPublicId,
      mimeType: mimeType || 'application/pdf',
      uploadedBy: req.user?._id, // If using authentication
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      category: category || 'tangazo',
      metadata: metadata || {},
      status: 'active',
      downloadCount: 0,
      viewCount: 0
    });

    await newPDF.save();

    res.status(201).json({
      success: true,
      message: 'PDF uploaded successfully',
      data: newPDF
    });
  } catch (error) {
    console.error('Upload PDF Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading PDF',
      error: error.message
    });
  }
};

// Get all PDFs with pagination, filtering, and search
exports.getAllPDFs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      search,
      category,
      status = 'active',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status };

    // Add search functionality
    if (search) {
      query.$or = [
        { fileName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add user filter if authenticated
    if (req.query.myFiles && req.user) {
      query.uploadedBy = req.user._id;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const pdfs = await PDF.find(query)
      .populate('uploadedBy', 'name email') // Populate user info if needed
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const totalCount = await PDF.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pdfs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get PDFs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PDFs',
      error: error.message
    });
  }
};

// Get single PDF by ID
exports.getPDFById = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await PDF.findById(id).populate('uploadedBy', 'name email');

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Increment view count
    pdf.viewCount += 1;
    await pdf.save();

    res.status(200).json({
      success: true,
      data: pdf
    });
  } catch (error) {
    console.error('Get PDF Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PDF',
      error: error.message
    });
  }
};

// Update PDF metadata
exports.updatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.cloudinaryPublicId;
    delete updates.cloudinaryUrl;
    delete updates.uploadedBy;
    delete updates.createdAt;
    delete updates.downloadCount;
    delete updates.viewCount;

    const pdf = await PDF.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PDF updated successfully',
      data: pdf
    });
  } catch (error) {
    console.error('Update PDF Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating PDF',
      error: error.message
    });
  }
};

// Delete PDF (soft delete) - This is what the frontend calls
exports.softDeletePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await PDF.findByIdAndUpdate(
      id,
      { status: 'deleted' },
      { new: true }
    );

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF haipo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Umefanikiwa Kutengeneza Tangazo',
      data: pdf
    });
  } catch (error) {
    console.error('Delete PDF Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting PDF',
      error: error.message
    });
  }
};

// Permanently delete PDF (from database and Cloudinary)
exports.permanentDeletePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await PDF.findById(id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Only delete from Cloudinary if it's an actual PDF file (not rich text)
    if (pdf.mimeType === 'application/pdf' && !pdf.cloudinaryUrl.startsWith('richtext://')) {
      try {
        await cloudinary.uploader.destroy(pdf.cloudinaryPublicId, {
          resource_type: 'raw'
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await PDF.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'PDF permanently deleted'
    });
  } catch (error) {
    console.error('Permanent Delete PDF Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting PDF',
      error: error.message
    });
  }
};

// Increment download count
exports.incrementDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await PDF.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pdf
    });
  } catch (error) {
    console.error('Increment Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing download count',
      error: error.message
    });
  }
};

// Get PDF statistics - CRITICAL: This must match frontend expectations
exports.getPDFStats = async (req, res) => {
  try {
    const totalPDFs = await PDF.countDocuments({ status: 'active' });
    
    const totalSizeResult = await PDF.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);

    const totalDownloadsResult = await PDF.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    const totalViewsResult = await PDF.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);

    const categoryStats = await PDF.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUploads = await PDF.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fileName fileSize createdAt category');

    // Frontend expects these exact field names
    res.status(200).json({
      success: true,
      data: {
        totalPDFs,
        totalSize: totalSizeResult[0]?.total || 0,
        totalDownloads: totalDownloadsResult[0]?.total || 0,
        totalViews: totalViewsResult[0]?.total || 0,
        categoryStats,
        recentUploads
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};