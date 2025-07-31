const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Budget name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Budget amount must be greater than 0']
  },
  period: {
    type: String,
    required: [true, 'Budget period is required'],
    enum: ['weekly', 'monthly', 'quarterly', 'yearly']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'exceeded', 'paused'],
    default: 'active'
  },
  alertThreshold: {
    type: Number,
    default: 80,
    min: [0, 'Alert threshold cannot be negative'],
    max: [100, 'Alert threshold cannot exceed 100']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
budgetSchema.index({ userid: 1, category: 1 });
budgetSchema.index({ userid: 1, status: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });

// Virtual for progress percentage
budgetSchema.virtual('progressPercentage').get(function() {
  return this.amount > 0 ? Math.min((this.spent / this.amount) * 100, 100) : 0;
});

// Virtual for remaining amount
budgetSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.amount - this.spent, 0);
});

// Virtual for days remaining
budgetSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - now;
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
});

// Method to check if budget is over threshold
budgetSchema.methods.isOverThreshold = function() {
  return this.progressPercentage >= this.alertThreshold;
};

// Method to check if budget is exceeded
budgetSchema.methods.isExceeded = function() {
  return this.spent > this.amount;
};

// Pre-save middleware to update status
budgetSchema.pre('save', function(next) {
  if (this.isExceeded()) {
    this.status = 'exceeded';
  } else if (this.progressPercentage >= 100) {
    this.status = 'completed';
  } else if (this.daysRemaining <= 0) {
    this.status = 'completed';
  }
  next();
});

// Ensure virtuals are included in JSON output
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
