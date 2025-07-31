import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add user data
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('Lab-Management-User') || '{}');
    if (user._id && config.data) {
      config.data.userid = user._id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Transaction API calls
export const transactionAPI = {
  // Get all transactions
  getAllTransactions: (filters) => {
    return api.post('/transactions/get-all-transactions', filters);
  },

  // Add new transaction
  addTransaction: (transactionData) => {
    return api.post('/transactions/add-transaction', transactionData);
  },

  // Edit transaction
  editTransaction: (transactionId, payload) => {
    return api.post('/transactions/edit-transaction', {
      transactionId,
      payload,
    });
  },

  // Delete transaction
  deleteTransaction: (transactionId) => {
    return api.post('/transactions/delete-transaction', { transactionId });
  },

  // Get transaction statistics
  getTransactionStats: (filters) => {
    return api.post('/transactions/get-stats', filters);
  },
};

// User API calls
export const userAPI = {
  // Login user
  login: (credentials) => {
    return api.post('/users/login', credentials);
  },

  // Register user
  register: (userData) => {
    return api.post('/users/register', userData);
  },

  // Get user profile
  getProfile: () => {
    return api.get('/users/profile');
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },
};

// Budget API calls
export const budgetAPI = {
  // Get all budgets
  getAllBudgets: () => {
    return api.get('/budgets/get-all-budgets');
  },

  // Add new budget
  addBudget: (budgetData) => {
    return api.post('/budgets/add-budget', budgetData);
  },

  // Edit budget
  editBudget: (budgetId, payload) => {
    return api.post('/budgets/edit-budget', {
      budgetId,
      payload,
    });
  },

  // Delete budget
  deleteBudget: (budgetId) => {
    return api.post('/budgets/delete-budget', { budgetId });
  },

  // Get budget status
  getBudgetStatus: (budgetId) => {
    return api.get(`/budgets/status/${budgetId}`);
  },
};

// Goals API calls
export const goalsAPI = {
  // Get all goals
  getAllGoals: () => {
    return api.get('/goals/get-all-goals');
  },

  // Add new goal
  addGoal: (goalData) => {
    return api.post('/goals/add-goal', goalData);
  },

  // Edit goal
  editGoal: (goalId, payload) => {
    return api.post('/goals/edit-goal', {
      goalId,
      payload,
    });
  },

  // Delete goal
  deleteGoal: (goalId) => {
    return api.post('/goals/delete-goal', { goalId });
  },

  // Update goal progress
  updateGoalProgress: (goalId, amount) => {
    return api.post('/goals/update-progress', { goalId, amount });
  },
};

export default api;
