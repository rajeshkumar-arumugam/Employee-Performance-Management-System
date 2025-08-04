const express = require('express');
const router = express.Router();
const { PerformanceReview, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// Get all reviews
router.get('/', authenticate, async (req, res) => {
  try {
    const reviews = await PerformanceReview.findAll({
      include: [
        { model: User, as: 'employee', attributes: ['firstName', 'lastName'] }
      ]
    });

    const reviewsWithEmployeeName = reviews.map(review => ({
      ...review.toJSON(),
      employeeName: `${review.employee.firstName} ${review.employee.lastName}`
    }));

    res.json(reviewsWithEmployeeName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create review
router.post('/', authenticate, authorize('admin', 'hr', 'manager'), async (req, res) => {
  try {
    const review = await PerformanceReview.create({
      ...req.body,
      reviewerId: req.user.id,
      submittedAt: new Date()
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
});

module.exports = router;