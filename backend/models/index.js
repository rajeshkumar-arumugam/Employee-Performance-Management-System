const User = require('./User');
const Goal = require('./Goal');
const PerformanceReview = require('./PerformanceReview');
const { Skill, UserSkill, SkillAssessment } = require('./Skill');
const TimeLog = require('./TimeLog');

/**
 * Model Associations
 * Defines relationships between different models
 */

// User associations
User.hasMany(Goal, { foreignKey: 'employeeId', as: 'goals' });
User.hasMany(Goal, { foreignKey: 'assignedBy', as: 'assignedGoals' });
User.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
User.hasMany(User, { foreignKey: 'managerId', as: 'subordinates' });

// Goal associations
Goal.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });
Goal.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

// Performance Review associations
User.hasMany(PerformanceReview, { foreignKey: 'employeeId', as: 'receivedReviews' });
User.hasMany(PerformanceReview, { foreignKey: 'reviewerId', as: 'givenReviews' });
PerformanceReview.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });
PerformanceReview.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// Skill associations
User.belongsToMany(Skill, { 
  through: UserSkill, 
  foreignKey: 'userId',
  otherKey: 'skillId',
  as: 'skills'
});
Skill.belongsToMany(User, { 
  through: UserSkill, 
  foreignKey: 'skillId',
  otherKey: 'userId',
  as: 'users'
});

// UserSkill associations
UserSkill.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserSkill.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' });
UserSkill.belongsTo(User, { foreignKey: 'assessedBy', as: 'assessor' });
UserSkill.hasMany(SkillAssessment, { foreignKey: 'userSkillId', as: 'assessments' });

// SkillAssessment associations
SkillAssessment.belongsTo(UserSkill, { foreignKey: 'userSkillId', as: 'userSkill' });
SkillAssessment.belongsTo(User, { foreignKey: 'assessedBy', as: 'assessor' });

// TimeLog associations
User.hasMany(TimeLog, { foreignKey: 'user_id', as: 'timeLogs' });
TimeLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Goal.hasMany(TimeLog, { foreignKey: 'goal_id', as: 'timeLogs' });
TimeLog.belongsTo(Goal, { foreignKey: 'goal_id', as: 'goal' });

/**
 * Sync all models with database
 */
const syncModels = async (force = false) => {
  try {
    await User.sync({ force });
    await Skill.sync({ force });
    await Goal.sync({ force });
    await PerformanceReview.sync({ force });
    await UserSkill.sync({ force });
    await SkillAssessment.sync({ force });
    await TimeLog.sync({ force });
    
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

module.exports = {
  User,
  Goal,
  PerformanceReview,
  Skill,
  UserSkill,
  SkillAssessment,
  TimeLog,
  syncModels
};