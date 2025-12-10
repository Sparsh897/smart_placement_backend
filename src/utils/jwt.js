const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate tokens for user
const generateTokensForUser = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    loginType: user.loginType
  };
  
  const accessToken = generateToken(payload);
  
  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRES_IN
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateTokensForUser,
  JWT_SECRET
};