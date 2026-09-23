const express = require('express');
const router = express.Router();
const { getAdminOverview } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/overview', protect, authorize('admin'), getAdminOverview);

module.exports = router;
