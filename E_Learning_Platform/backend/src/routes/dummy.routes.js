const express = require('express');
const router = express.Router();
const {
  getDummyStatus,
  injectDummyData,
  cleanDummyData,
} = require('../controllers/dummy.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All dummy data management routes require Administrator privileges
router.use(protect, authorize('admin'));

router.get('/status', getDummyStatus);
router.post('/inject', injectDummyData);
router.delete('/clean', cleanDummyData);

module.exports = router;
