const { body, param } = require('express-validator');

// Register validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('college')
    .trim()
    .notEmpty()
    .withMessage('College/University name is required'),
  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch or specialization is required'),
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('college')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('College cannot be empty'),
  body('branch')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Branch cannot be empty'),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Course creation validation
const validateCreateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Course category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Course duration is required'),
  body('certificationDetails')
    .trim()
    .notEmpty()
    .withMessage('Certification details are required'),
];

// Internship application validation
const validateApplyInternship = [
  body('internshipId')
    .trim()
    .notEmpty()
    .withMessage('Internship ID is required')
    .isMongoId()
    .withMessage('Invalid Internship ID format'),
  body('college')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),
  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch is required'),
  body('resumeName')
    .trim()
    .notEmpty()
    .withMessage('Resume document name is required'),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateCreateCourse,
  validateApplyInternship,
};
