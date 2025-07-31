import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { transactionAPI } from '../services/api';
import { calculateTransactionStats, getDateRange } from '../utils/helpers';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    frequency: '30',
    type: 'all',
    selectedRange: [],
  });

  // Fetch transactions based on filters
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAllTransactions(filters);
      setTransactions(response.data);
      
      // Calculate stats
      const calculatedStats = calculateTransactionStats(response.data);
      setStats(calculatedStats);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    }
  }, [filters]);

  // Add new transaction
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      await transactionAPI.addTransaction(transactionData);
      message.success('Transaction added successfully');
      await fetchTransactions(); // Refresh data
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
      console.error('Error adding transaction:', error);
      return false;
    }
  };

  // Edit transaction
  const editTransaction = async (transactionId, transactionData) => {
    try {
      setLoading(true);
      await transactionAPI.editTransaction(transactionId, transactionData);
      message.success('Transaction updated successfully');
      await fetchTransactions(); // Refresh data
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      message.error('Failed to update transaction');
      console.error('Error updating transaction:', error);
      return false;
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    try {
      setLoading(true);
      await transactionAPI.deleteTransaction(transactionId);
      message.success('Transaction deleted successfully');
      await fetchTransactions(); // Refresh data
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      message.error('Failed to delete transaction');
      console.error('Error deleting transaction:', error);
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      frequency: '30',
      type: 'all',
      selectedRange: [],
    });
  };

  // Get filtered transactions
  const getFilteredTransactions = (additionalFilters = {}) => {
    let filtered = [...transactions];

    // Apply type filter
    if (additionalFilters.type && additionalFilters.type !== 'all') {
      filtered = filtered.filter(t => t.type === additionalFilters.type);
    }

    // Apply category filter
    if (additionalFilters.category) {
      filtered = filtered.filter(t => t.category === additionalFilters.category);
    }

    // Apply date range filter
    if (additionalFilters.dateRange) {
      const { startDate, endDate } = getDateRange(
        additionalFilters.frequency || 'custom',
        additionalFilters.dateRange
      );
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    return filtered;
  };

  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Get transactions by category
  const getTransactionsByCategory = (category) => {
    return transactions.filter(t => t.category === category);
  };

  // Get monthly data for charts
  const getMonthlyData = () => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, balance: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
      
      monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expense;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  // Fetch transactions on component mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    stats,
    filters,
    addTransaction,
    editTransaction,
    deleteTransaction,
    updateFilters,
    resetFilters,
    fetchTransactions,
    getFilteredTransactions,
    getRecentTransactions,
    getTransactionsByCategory,
    getMonthlyData,
  };
};
