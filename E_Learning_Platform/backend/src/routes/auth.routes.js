const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  punchAttendance,
  createSupportTicket,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { validateRegister, validateLogin, validateProfileUpdate } = require('../validators/index');

router.post('/register', validateRegister, validateRequest, register);
router.post('/login', validateLogin, validateRequest, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update', protect, validateProfileUpdate, validateRequest, updateProfile);
router.post('/attendance/punch', protect, punchAttendance);
router.post('/support/ticket', protect, createSupportTicket);

module.exports = router;
