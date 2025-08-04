const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  adminUpdatePassword,
  adminGetUserPassword,
  getAllUsers,
  updateUser,
  deleteUser 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (but typically restricted to admin/HR in production)
 */
router.post('/register', validateUserRegistration, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateUserLogin, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, changePassword);

/**
 * @route   PUT /api/auth/admin/update-password
 * @desc    Admin update user password
 * @access  Admin only
 */
router.put('/admin/update-password', authenticate, authorize('admin'), adminUpdatePassword);

/**
 * @route   GET /api/auth/admin/user-password/:userId
 * @desc    Admin get user password
 * @access  Admin only
 */
router.get('/admin/user-password/:userId', authenticate, authorize('admin'), adminGetUserPassword);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Admin/HR only
 */
router.get('/users', authenticate, authorize('admin', 'hr'), getAllUsers);

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Update user
 * @access  Admin/HR only
 */
router.put('/users/:id', authenticate, authorize('admin', 'hr'), updateUser);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;