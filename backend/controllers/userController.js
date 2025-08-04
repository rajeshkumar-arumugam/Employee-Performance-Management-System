const { User, Goal, PerformanceReview } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all users (Admin/HR only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, role } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { employeeId: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (department) whereClause.department = department;
    if (role) whereClause.role = role;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'subordinates', attributes: ['id', 'firstName', 'lastName'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['firstName', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          hasNext: offset + users.length < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email', 'position'] },
        { model: User, as: 'subordinates', attributes: ['id', 'firstName', 'lastName', 'email', 'position'] }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new user (Admin/HR only)
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: userData.email },
          { employeeId: userData.employeeId }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or employee ID already exists'
      });
    }

    const user = await User.create(userData);
    
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user (Admin/HR or self)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.id;

    await user.update(updateData);
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'subordinates', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by setting isActive to false
    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user dashboard data
 */
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's goals
    const goals = await Goal.findAll({
      where: { employeeId: userId },
      order: [['dueDate', 'ASC']],
      limit: 5
    });

    // Get recent reviews
    const reviews = await PerformanceReview.findAll({
      where: { employeeId: userId },
      include: [
        { model: User, as: 'reviewer', attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Calculate statistics
    const totalGoals = await Goal.count({ where: { employeeId: userId } });
    const completedGoals = await Goal.count({ 
      where: { employeeId: userId, status: 'completed' } 
    });
    const avgRating = await PerformanceReview.findOne({
      where: { employeeId: userId },
      attributes: [[sequelize.fn('AVG', sequelize.col('overall_rating')), 'avgRating']]
    });

    res.json({
      success: true,
      data: {
        goals,
        reviews,
        statistics: {
          totalGoals,
          completedGoals,
          goalCompletionRate: totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0,
          averageRating: avgRating?.dataValues?.avgRating ? parseFloat(avgRating.dataValues.avgRating).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserDashboard
};