const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. Please login.' 
      });
    }
    
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // { userId, username, email }
    next();
    
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid or expired token. Please login again.' 
    });
  }
};

// Optional auth - doesn't block if not logged in
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
    }
  } catch (err) {
    // Token invalid, continue without user
  }
  next();
};

module.exports = { authenticateToken, optionalAuth, JWT_SECRET };