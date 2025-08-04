const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Skill Model - Master list of skills
 */
const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  category: {
    type: DataTypes.ENUM('technical', 'soft_skills', 'leadership', 'domain_knowledge', 'tools'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'skills'
});

/**
 * UserSkill Model - Junction table for user skills with proficiency levels
 */
const UserSkill = sequelize.define('UserSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'skills',
      key: 'id'
    }
  },
  proficiencyLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  assessedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assessmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  developmentPlan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'user_skills',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'skill_id']
    },
    {
      fields: ['proficiency_level']
    },
    {
      fields: ['rating']
    }
  ]
});

/**
 * SkillAssessment Model - Track skill development over time
 */
const SkillAssessment = sequelize.define('SkillAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userSkillId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_skills',
      key: 'id'
    }
  },
  previousRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  newRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  assessedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assessmentType: {
    type: DataTypes.ENUM('self', 'manager', 'peer', 'formal_review'),
    allowNull: false
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  improvementSuggestions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'skill_assessments'
});

module.exports = { Skill, UserSkill, SkillAssessment };