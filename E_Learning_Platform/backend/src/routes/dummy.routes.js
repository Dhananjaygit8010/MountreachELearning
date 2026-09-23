const express = require('express');
const router = express.Router();
const {
  getDummyStatus,
  injectDummyData,
  cleanDummyData,
} = require('../controllers/dummy.controller');

router.get('/status', getDummyStatus);
router.post('/inject', injectDummyData);
router.delete('/clean', cleanDummyData);

module.exports = router;
