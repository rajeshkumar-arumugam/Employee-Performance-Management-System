const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

/**
 * User Model - Represents employees and admins in the system
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 20]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'hr', 'manager', 'employee'),
    defaultValue: 'employee'
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dateOfJoining: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        if (user.password.length < 6 || user.password.length > 100) {
          throw new Error('Password must be between 6 and 100 characters');
        }
        try {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        } catch (error) {
          throw new Error('Password hashing failed');
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        if (user.password.length < 6 || user.password.length > 100) {
          throw new Error('Password must be between 6 and 100 characters');
        }
        try {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        } catch (error) {
          throw new Error('Password hashing failed');
        }
      }
    }
  }
});

/**
 * Instance method to check password
 */
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Instance method to get full name
 */
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Define associations
 */
User.associate = function(models) {
  // Self-referencing association for manager-employee relationship
  User.belongsTo(models.User, {
    as: 'manager',
    foreignKey: 'managerId'
  });
  
  User.hasMany(models.User, {
    as: 'subordinates',
    foreignKey: 'managerId'
  });
};

module.exports = User;