const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Goal Model - Represents employee goals (quarterly/annual)
 */
const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('performance', 'learning', 'leadership', 'innovation', 'collaboration'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'in_progress', 'completed', 'cancelled', 'overdue'),
    defaultValue: 'draft'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  estimated_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  logged_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  targetValue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  currentValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('Due date must be after start date');
        }
      }
    }
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  quarter: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Q1', 'Q2', 'Q3', 'Q4']]
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2030
    }
  },
  weight: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'goals',
  underscored: true,
  indexes: [
    {
      fields: ['employee_id', 'quarter', 'year']
    },
    {
      fields: ['status']
    },
    {
      fields: ['due_date']
    }
  ]
});

/**
 * Instance method to calculate progress percentage
 */
Goal.prototype.calculateProgress = function() {
  if (this.targetValue && this.currentValue) {
    return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
  }
  return this.progress;
};

/**
 * Instance method to check if goal is overdue
 */
Goal.prototype.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'completed';
};

module.exports = Goal;