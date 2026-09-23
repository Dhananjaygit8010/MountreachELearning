const jwt = require('jsonwebtoken');

const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE || '24h') => {
  return jwt.sign(
    { id: userId, userId },
    process.env.JWT_SECRET || 'mountreach_jwt_secret_key_123',
    { expiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mountreach_jwt_secret_key_123');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
