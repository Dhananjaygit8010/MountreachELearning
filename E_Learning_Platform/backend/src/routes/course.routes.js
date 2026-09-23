const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { validateCreateCourse } = require('../validators/index');

// Public catalog routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Student enrollment route
router.post('/:id/enroll', protect, enrollCourse);

// Management routes (Instructor & Admin)
router.post('/', protect, authorize('instructor', 'admin'), validateCreateCourse, validateRequest, createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
