const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token received:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, user ID:', decoded.id);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found');
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
