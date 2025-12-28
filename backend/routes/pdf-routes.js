// ============================================
// Routes (routes/pdfRoutes.js)
// Updated to match frontend API calls
// ============================================
const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf-controller');
// const { authenticateUser } = require('../middleware/auth'); // Uncomment if using auth

// ======================
// PUBLIC ROUTES
// ======================

// Get all PDFs with filtering, search, and pagination
// Frontend calls: `${API_BASE_URL}/pdfs?status=active`
router.get('/pdfs', pdfController.getAllPDFs);

// Get PDF statistics
// Frontend calls: `${API_BASE_URL}/pdfs/stats`
router.get('/pdfs/stats', pdfController.getPDFStats);

// Get single PDF by ID (increments view count)
// Frontend calls: `${API_BASE_URL}/pdfs/:id`
router.get('/pdfs/:id', pdfController.getPDFById);

// Increment download count (called when user downloads)
// Frontend may call: `${API_BASE_URL}/pdfs/:id/download`
router.post('/pdfs/:id/download', pdfController.incrementDownload);

// ======================
// PROTECTED ROUTES
// ======================
// Uncomment authenticateUser middleware if you have authentication

// Create/Upload new PDF
// Frontend calls: `${API_BASE_URL}/pdfs` (POST)
router.post('/pdfs', /* authenticateUser, */ pdfController.uploadPDF);

// Update PDF metadata
// Frontend may call: `${API_BASE_URL}/pdfs/:id` (PATCH)
router.patch('/pdfs/:id', /* authenticateUser, */ pdfController.updatePDF);

// Soft delete PDF (sets status to 'deleted')
// Frontend calls: `${API_BASE_URL}/pdfs/:id` (DELETE)
router.delete('/pdfs/:id', /* authenticateUser, */ pdfController.softDeletePDF);

// Permanently delete PDF (removes from DB and Cloudinary)
// Frontend may call: `${API_BASE_URL}/pdfs/:id/permanent` (DELETE)
router.delete('/pdfs/:id/permanent', /* authenticateUser, */ pdfController.permanentDeletePDF);

module.exports = router;