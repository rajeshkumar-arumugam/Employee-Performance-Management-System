const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Performance Review Model - 360-degree feedback system
 */
const PerformanceReview = sequelize.define('PerformanceReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewType: {
    type: DataTypes.ENUM('self', 'peer', 'manager', 'subordinate', 'customer'),
    allowNull: false
  },
  reviewPeriod: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Format: Q1-2024, Q2-2024, etc.'
  },
  overallRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  technicalSkills: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  communicationSkills: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  teamwork: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  leadership: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  problemSolving: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  initiative: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  qualityOfWork: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  timeManagement: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  adaptability: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  strengths: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  areasForImprovement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  goals: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'approved'),
    defaultValue: 'draft'
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  finalRating: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'performance_reviews',
  indexes: [
    {
      fields: ['employee_id', 'review_period']
    },
    {
      fields: ['reviewer_id']
    },
    {
      fields: ['review_type']
    },
    {
      fields: ['status']
    }
  ]
});

/**
 * Instance method to calculate average skill rating
 */
PerformanceReview.prototype.getAverageSkillRating = function() {
  const skills = [
    this.technicalSkills,
    this.communicationSkills,
    this.teamwork,
    this.leadership,
    this.problemSolving,
    this.initiative,
    this.qualityOfWork,
    this.timeManagement,
    this.adaptability
  ].filter(skill => skill !== null);
  
  return skills.length > 0 ? skills.reduce((sum, skill) => sum + skill, 0) / skills.length : 0;
};

module.exports = PerformanceReview;