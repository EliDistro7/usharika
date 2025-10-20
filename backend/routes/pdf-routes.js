// ============================================
// 3. Routes (routes/pdfRoutes.js)
// ============================================
const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf-controller');
// const { authenticateUser } = require('../middleware/auth'); // Uncomment if using auth

// Public routes
router.get('/pdfs', pdfController.getAllPDFs);
router.get('/pdfs/stats', pdfController.getPDFStats);
router.get('/pdfs/:id', pdfController.getPDFById);
router.post('/pdfs/:id/download', pdfController.incrementDownload);

// Protected routes (uncomment auth middleware if needed)
router.post('/pdfs', /* authenticateUser, */ pdfController.uploadPDF);
router.patch('/pdfs/:id', /* authenticateUser, */ pdfController.updatePDF);
router.delete('/pdfs/:id', /* authenticateUser, */ pdfController.softDeletePDF);
router.delete('/pdfs/:id/permanent', /* authenticateUser, */ pdfController.permanentDeletePDF);

module.exports = router;