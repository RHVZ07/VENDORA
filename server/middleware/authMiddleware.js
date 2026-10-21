const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'vendora_default_secret_key_2026'
      );

      req.user = await User.findById(decoded.id).select('-password').populate('vendorProfile');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'User account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
