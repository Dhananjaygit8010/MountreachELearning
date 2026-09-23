const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  applyInternship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  createInternship,
  deleteInternship,
} = require('../controllers/internship.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { validateApplyInternship } = require('../validators/index');

// Public internship listings
router.get('/', getAllInternships);

// Student application endpoints
router.post('/apply', protect, validateApplyInternship, validateRequest, applyInternship);
router.get('/my-applications', protect, getMyApplications);

// Admin / Management endpoints
router.get('/admin/all-applications', protect, authorize('admin'), getAllApplications);
router.put('/admin/applications/:id/status', protect, authorize('admin'), updateApplicationStatus);
router.post('/', protect, authorize('admin'), createInternship);
router.delete('/:id', protect, authorize('admin'), deleteInternship);

module.exports = router;
