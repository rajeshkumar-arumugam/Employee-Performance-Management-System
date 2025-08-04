const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TimeLog = sequelize.define('TimeLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  goal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'goals',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hours_spent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  work_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'time_logs',
  timestamps: true,
  underscored: true,
});

module.exports = TimeLog;