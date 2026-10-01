const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllStudents,
  getAllTickets,
  updateTicketStatus,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/tickets', protect, authorize('admin'), getAllTickets);
router.put('/tickets/:ticketId/status', protect, authorize('admin'), updateTicketStatus);

module.exports = router;
