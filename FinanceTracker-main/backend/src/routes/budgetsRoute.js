const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all budgets for a user
router.get('/get-all-budgets', async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const budgets = await Budget.find({ userid }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new budget
router.post('/add-budget', async (req, res) => {
  try {
    const budgetData = {
      ...req.body,
      spent: 0,
      status: 'active'
    };

    const budget = new Budget(budgetData);
    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Edit budget
router.post('/edit-budget', async (req, res) => {
  try {
    const { budgetId, payload } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    Object.assign(budget, payload);
    await budget.save();

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete budget
router.post('/delete-budget', async (req, res) => {
  try {
    const { budgetId } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    await Budget.findByIdAndDelete(budgetId);

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
