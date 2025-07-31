const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    maxlength: [100, 'Goal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Goal type is required'],
    enum: ['emergency', 'vacation', 'car', 'home', 'education', 'retirement', 'other']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'savings'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  milestones: [{
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    achieved: {
      type: Boolean,
      default: false
    },
    achievedDate: Date
  }],
  contributions: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
goalSchema.index({ userid: 1, status: 1 });
goalSchema.index({ userid: 1, type: 1 });
goalSchema.index({ targetDate: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  return this.targetAmount > 0 ? Math.min((this.currentAmount / this.targetAmount) * 100, 100) : 0;
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const targetDate = new Date(this.targetDate);
  const diffTime = targetDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for monthly savings needed
goalSchema.virtual('monthlySavingsNeeded').get(function() {
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0) return 0;
  
  const monthsRemaining = daysRemaining / 30.44; // Average days per month
  return monthsRemaining > 0 ? this.remainingAmount / monthsRemaining : this.remainingAmount;
});

// Virtual for weekly savings needed
goalSchema.virtual('weeklySavingsNeeded').get(function() {
  const daysRemaining = this.daysRemaining;
  if (daysRemaining <= 0) return 0;
  
  const weeksRemaining = daysRemaining / 7;
  return weeksRemaining > 0 ? this.remainingAmount / weeksRemaining : this.remainingAmount;
});

// Method to check if goal is completed
goalSchema.methods.isCompleted = function() {
  return this.currentAmount >= this.targetAmount;
};

// Method to check if goal is overdue
goalSchema.methods.isOverdue = function() {
  return new Date() > new Date(this.targetDate) && !this.isCompleted();
};

// Method to add contribution
goalSchema.methods.addContribution = function(amount, note = '') {
  this.contributions.push({
    amount: amount,
    note: note
  });
  this.currentAmount += amount;
  
  // Check if goal is completed
  if (this.isCompleted()) {
    this.status = 'completed';
  }
  
  // Check milestones
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && this.currentAmount >= milestone.amount) {
      milestone.achieved = true;
      milestone.achievedDate = new Date();
    }
  });
  
  return this.save();
};

// Method to get achievement rate
goalSchema.methods.getAchievementRate = function() {
  const totalDays = Math.ceil((new Date(this.targetDate) - new Date(this.createdAt)) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((new Date() - new Date(this.createdAt)) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) return 0;
  
  const expectedProgress = (daysPassed / totalDays) * 100;
  const actualProgress = this.progressPercentage;
  
  return actualProgress / expectedProgress;
};

// Pre-save middleware to update status
goalSchema.pre('save', function(next) {
  if (this.isCompleted() && this.status !== 'completed') {
    this.status = 'completed';
  }
  next();
});

// Ensure virtuals are included in JSON output
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
