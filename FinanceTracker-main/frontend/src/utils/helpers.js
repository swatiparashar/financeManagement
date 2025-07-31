import moment from 'moment';
import { CURRENCY, DATE_FORMATS } from '../constants';

// Format currency with proper locale
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
  }).format(Number(amount));
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// Format date
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  return moment(date).format(format);
};

// Get date range for frequency
export const getDateRange = (frequency, customRange = null) => {
  if (frequency === 'custom' && customRange) {
    return {
      startDate: moment(customRange[0]).startOf('day').toDate(),
      endDate: moment(customRange[1]).endOf('day').toDate(),
    };
  }

  const days = parseInt(frequency);
  return {
    startDate: moment().subtract(days, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate(),
  };
};

// Calculate transaction statistics
export const calculateTransactionStats = (transactions) => {
  const stats = {
    totalTransactions: transactions.length,
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
    categoryBreakdown: {},
    monthlyTrend: {},
  };

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount);
    const category = transaction.category;
    const month = moment(transaction.date).format('MMM YYYY');

    if (transaction.type === 'income') {
      stats.totalIncome += amount;
      stats.incomeTransactions += 1;
    } else {
      stats.totalExpense += amount;
      stats.expenseTransactions += 1;
    }

    // Category breakdown
    if (!stats.categoryBreakdown[category]) {
      stats.categoryBreakdown[category] = { income: 0, expense: 0, total: 0 };
    }
    stats.categoryBreakdown[category][transaction.type] += amount;
    stats.categoryBreakdown[category].total += amount;

    // Monthly trend
    if (!stats.monthlyTrend[month]) {
      stats.monthlyTrend[month] = { income: 0, expense: 0, balance: 0 };
    }
    if (transaction.type === 'income') {
      stats.monthlyTrend[month].income += amount;
    } else {
      stats.monthlyTrend[month].expense += amount;
    }
    stats.monthlyTrend[month].balance = 
      stats.monthlyTrend[month].income - stats.monthlyTrend[month].expense;
  });

  stats.totalBalance = stats.totalIncome - stats.totalExpense;
  stats.incomePercentage = stats.totalTransactions > 0 
    ? (stats.incomeTransactions / stats.totalTransactions) * 100 
    : 0;
  stats.expensePercentage = stats.totalTransactions > 0 
    ? (stats.expenseTransactions / stats.totalTransactions) * 100 
    : 0;

  return stats;
};

// Get user from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem('Lab-Management-User');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Set user in localStorage
export const setUser = (user) => {
  try {
    localStorage.setItem('Lab-Management-User', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user in localStorage:', error);
  }
};

// Remove user from localStorage
export const removeUser = () => {
  try {
    localStorage.removeItem('Lab-Management-User');
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random color
export const getRandomColor = () => {
  const colors = [
    '#5ab7a6', '#545f71', '#52c41a', '#faad14', '#ff4d4f',
    '#1890ff', '#722ed1', '#eb2f96', '#fa8c16', '#13c2c2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sort array by date
export const sortByDate = (array, dateField = 'date', order = 'desc') => {
  return array.sort((a, b) => {
    const dateA = moment(a[dateField]);
    const dateB = moment(b[dateField]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const transactionDate = moment(transaction.date);
    return transactionDate.isBetween(startDate, endDate, 'day', '[]');
  });
};

// Calculate budget progress
export const calculateBudgetProgress = (spent, budget) => {
  if (!budget || budget === 0) return 0;
  return Math.min((spent / budget) * 100, 100);
};

// Get budget status
export const getBudgetStatus = (spent, budget) => {
  const progress = calculateBudgetProgress(spent, budget);
  if (progress >= 100) return 'exceeded';
  if (progress >= 80) return 'warning';
  if (progress >= 60) return 'good';
  return 'excellent';
};

// Calculate goal progress
export const calculateGoalProgress = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Export/download data as CSV
export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
