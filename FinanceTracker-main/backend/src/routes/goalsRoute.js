const express = require('express');
const Goal = require('../models/Goal');
const router = express.Router();

// Get all goals for a user
router.get('/get-all-goals', async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const goals = await Goal.find({ userid }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new goal
router.post('/add-goal', async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      currentAmount: 0,
      status: 'active'
    };

    const goal = new Goal(goalData);
    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Edit goal
router.post('/edit-goal', async (req, res) => {
  try {
    const { goalId, payload } = req.body;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    Object.assign(goal, payload);
    await goal.save();

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete goal
router.post('/delete-goal', async (req, res) => {
  try {
    const { goalId } = req.body;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    await Goal.findByIdAndDelete(goalId);

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update goal progress (add contribution)
router.post('/update-progress', async (req, res) => {
  try {
    const { goalId, amount, note } = req.body;

    if (!goalId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Goal ID and positive amount are required'
      });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Add to current amount
    goal.currentAmount += amount;

    // Add contribution to history
    goal.contributions.push({
      amount: amount,
      note: note || '',
      date: new Date()
    });

    await goal.save();

    res.json({
      success: true,
      message: 'Contribution added successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
