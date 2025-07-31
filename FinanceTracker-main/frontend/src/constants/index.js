// Transaction categories
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Rental',
  'Gift',
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills',
  'Medical',
  'Education',
  'Travel',
  'Rent',
  'Utilities',
  'Insurance',
  'Other Expense'
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Frequency options
export const FREQUENCY_OPTIONS = [
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 365 Days', value: '365' },
  { label: 'Custom Range', value: 'custom' }
];

// Budget periods
export const BUDGET_PERIODS = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' }
];

// Goal types
export const GOAL_TYPES = [
  { label: 'Emergency Fund', value: 'emergency' },
  { label: 'Vacation', value: 'vacation' },
  { label: 'Car Purchase', value: 'car' },
  { label: 'Home Down Payment', value: 'home' },
  { label: 'Education', value: 'education' },
  { label: 'Retirement', value: 'retirement' },
  { label: 'Other', value: 'other' }
];

// Colors for charts and UI
export const COLORS = {
  PRIMARY: '#5ab7a6',
  SECONDARY: '#545f71',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
  INCOME: '#52c41a',
  EXPENSE: '#ff4d4f',
  GRADIENT: {
    PRIMARY: 'linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%)',
    CARD: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    SUCCESS: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    WARNING: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ERROR: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)'
  }
};

// Chart colors
export const CHART_COLORS = [
  '#5ab7a6', '#545f71', '#52c41a', '#faad14', '#ff4d4f', 
  '#1890ff', '#722ed1', '#eb2f96', '#fa8c16', '#13c2c2'
];

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'Lab-Management-User',
  THEME: 'finance-tracker-theme',
  PREFERENCES: 'finance-tracker-preferences'
};

// API endpoints
export const API_ENDPOINTS = {
  TRANSACTIONS: {
    GET_ALL: '/transactions/get-all-transactions',
    ADD: '/transactions/add-transaction',
    EDIT: '/transactions/edit-transaction',
    DELETE: '/transactions/delete-transaction',
    STATS: '/transactions/get-stats'
  },
  USERS: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile'
  },
  BUDGETS: {
    GET_ALL: '/budgets/get-all-budgets',
    ADD: '/budgets/add-budget',
    EDIT: '/budgets/edit-budget',
    DELETE: '/budgets/delete-budget',
    STATUS: '/budgets/status'
  },
  GOALS: {
    GET_ALL: '/goals/get-all-goals',
    ADD: '/goals/add-goal',
    EDIT: '/goals/edit-goal',
    DELETE: '/goals/delete-goal',
    UPDATE_PROGRESS: '/goals/update-progress'
  }
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MM/DD/YY'
};

// Validation rules
export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: 'This field is required' },
  EMAIL: {
    type: 'email',
    message: 'Please enter a valid email address'
  },
  MIN_PASSWORD: {
    min: 6,
    message: 'Password must be at least 6 characters'
  },
  POSITIVE_NUMBER: {
    type: 'number',
    min: 0.01,
    message: 'Amount must be greater than 0'
  }
};

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100']
};

// Currency settings
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'en-US'
};

// Export utility function for formatting currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
  }).format(amount);
};

// Export utility function for formatting percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};
