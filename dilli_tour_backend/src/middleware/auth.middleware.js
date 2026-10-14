const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/database');

/**
 * Protect routes — verifies JWT and attaches admin to req.admin.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account not found or inactive.' });
    }

    req.admin = admin;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Restrict access to specific admin roles.
 * Usage: restrict('SUPER_ADMIN', 'ADMIN')
 */
const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }
    return next();
  };
};

module.exports = { protect, restrict };
