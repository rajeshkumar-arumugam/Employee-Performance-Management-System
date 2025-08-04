const express = require('express');
const router = express.Router();
const { Goal, User, TimeLog } = require('../models');
const { authenticate } = require('../middleware/auth');

// Get all goals
router.get('/', authenticate, async (req, res) => {
  try {
    const whereClause = req.user.role === 'employee' 
      ? { employee_id: req.user.id }
      : {};

    const goals = await Goal.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'employee', attributes: ['firstName', 'lastName'] },
        { model: TimeLog, as: 'timeLogs', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }
      ]
    });

    const goalsWithProgress = goals.map(goal => {
      const timeLogs = goal.timeLogs || [];
      const loggedHours = timeLogs.reduce((sum, log) => sum + parseFloat(log.hours_spent), 0);
      const progress = goal.estimated_hours > 0 ? Math.min(Math.round((loggedHours / goal.estimated_hours) * 100), 100) : 0;
      
      return {
        ...goal.toJSON(),
        loggedHours,
        progress,
        employeeName: `${goal.employee.firstName} ${goal.employee.lastName}`,
        timeLogs: timeLogs
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create goal
router.post('/', authenticate, async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      assignedBy: req.user.id
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
});

// Update goal
router.put('/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await Goal.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const goal = await Goal.findByPk(req.params.id);
      res.json(goal);
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating goal', error: error.message });
  }
});

// Delete goal
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Goal.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Goal deleted successfully' });
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
});

// Log time for a goal
router.post('/:id/time-log', authenticate, async (req, res) => {
  try {
    const timeLog = await TimeLog.create({
      goal_id: req.params.id,
      user_id: req.user.id,
      ...req.body
    });
    res.status(201).json(timeLog);
  } catch (error) {
    res.status(400).json({ message: 'Error logging time', error: error.message });
  }
});

// Update time log
router.put('/time-log/:logId', authenticate, async (req, res) => {
  try {
    const timeLog = await TimeLog.findByPk(req.params.logId);
    if (!timeLog) {
      return res.status(404).json({ message: 'Time log not found' });
    }
    
    if (timeLog.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }
    
    await timeLog.update(req.body);
    res.json(timeLog);
  } catch (error) {
    res.status(400).json({ message: 'Error updating time log', error: error.message });
  }
});

// Delete time log
router.delete('/time-log/:logId', authenticate, async (req, res) => {
  try {
    const timeLog = await TimeLog.findByPk(req.params.logId);
    if (!timeLog) {
      return res.status(404).json({ message: 'Time log not found' });
    }
    
    if (timeLog.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this log' });
    }
    
    await timeLog.destroy();
    res.json({ message: 'Time log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting time log', error: error.message });
  }
});

module.exports = router;