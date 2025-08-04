const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * User validation rules
 */
const validateUserRegistration = [
  body('employeeId')
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'hr', 'manager', 'employee'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Goal validation rules
 */
const validateGoal = [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('category')
    .isIn(['performance', 'learning', 'leadership', 'innovation', 'collaboration'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('quarter')
    .isIn(['Q1', 'Q2', 'Q3', 'Q4'])
    .withMessage('Invalid quarter'),
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  handleValidationErrors
];

/**
 * Performance Review validation rules
 */
const validatePerformanceReview = [
  body('employeeId')
    .isInt({ min: 1 })
    .withMessage('Valid employee ID is required'),
  body('reviewType')
    .isIn(['self', 'peer', 'manager', 'subordinate', 'customer'])
    .withMessage('Invalid review type'),
  body('reviewPeriod')
    .matches(/^Q[1-4]-\d{4}$/)
    .withMessage('Review period must be in format Q1-2024'),
  body('overallRating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  body('technicalSkills')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Technical skills rating must be between 1 and 5'),
  body('communicationSkills')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication skills rating must be between 1 and 5'),
  handleValidationErrors
];

/**
 * Skill validation rules
 */
const validateSkill = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Skill name must be between 2 and 100 characters'),
  body('category')
    .isIn(['technical', 'soft_skills', 'leadership', 'domain_knowledge', 'tools'])
    .withMessage('Invalid skill category'),
  handleValidationErrors
];

const validateUserSkill = [
  body('skillId')
    .isInt({ min: 1 })
    .withMessage('Valid skill ID is required'),
  body('proficiencyLevel')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid proficiency level'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  handleValidationErrors
];

/**
 * Parameter validation
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

/**
 * Query validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateGoal,
  validatePerformanceReview,
  validateSkill,
  validateUserSkill,
  validateId,
  validatePagination,
  handleValidationErrors
};