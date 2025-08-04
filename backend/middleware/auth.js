const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'subordinates', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not active.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Authorization middleware factory
 * Creates middleware to check user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Check if user can access employee data
 */
const canAccessEmployee = async (req, res, next) => {
  try {
    const targetEmployeeId = parseInt(req.params.employeeId || req.params.id);
    const currentUser = req.user;

    // Admin and HR can access all employees
    if (['admin', 'hr'].includes(currentUser.role)) {
      return next();
    }

    // Users can access their own data
    if (currentUser.id === targetEmployeeId) {
      return next();
    }

    // Managers can access their subordinates' data
    if (currentUser.role === 'manager') {
      const subordinateIds = currentUser.subordinates?.map(sub => sub.id) || [];
      if (subordinateIds.includes(targetEmployeeId)) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data or your subordinates\' data.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  canAccessEmployee
};