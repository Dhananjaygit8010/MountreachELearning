const { verifyToken } = require('../utils/jwt.util');
const User = require('../models/user.model');

// Middleware to protect routes via Bearer token or cookie
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Check Cookie fallback
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized to access this route. No token provided.',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        message: 'Not authorized. Token is invalid or has expired.',
      });
    }

    // Attach user payload
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      message: 'Authentication failed.',
    });
  }
};

// Role-based authorization guard
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
