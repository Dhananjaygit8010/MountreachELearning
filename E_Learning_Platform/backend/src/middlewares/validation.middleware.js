const { validationResult } = require('express-validator');

// Formats express-validator errors into clean, client-friendly error response
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      message: errorDetails[0]?.message || 'Invalid input data provided.',
      errors: errorDetails,
    });
  }
  next();
};

module.exports = { validateRequest };
