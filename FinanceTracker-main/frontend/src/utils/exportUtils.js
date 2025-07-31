import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate } from './helpers';
import moment from 'moment';

// Export transactions to CSV
export const exportToCSV = (transactions, filename = 'transactions') => {
  if (!transactions || transactions.length === 0) {
    throw new Error('No data to export');
  }

  const headers = ['Date', 'Type', 'Category', 'Reference', 'Description', 'Amount'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      formatDate(transaction.date),
      transaction.type,
      transaction.category,
      `"${transaction.reference}"`,
      `"${transaction.description}"`,
      transaction.amount
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${moment().format('YYYY-MM-DD')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export financial report to PDF
export const exportToPDF = async (transactions, stats, reportType = 'summary') => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Financial Report', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${moment().format('MMMM DD, YYYY')}`, pageWidth / 2, 30, { align: 'center' });
  
  let yPosition = 50;
  
  // Summary Section
  if (reportType === 'summary' || reportType === 'detailed') {
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Financial Summary', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    
    const summaryData = [
      ['Total Transactions', stats.totalTransactions.toString()],
      ['Total Income', formatCurrency(stats.totalIncome)],
      ['Total Expenses', formatCurrency(stats.totalExpense)],
      ['Net Balance', formatCurrency(stats.totalBalance)],
      ['Income Transactions', stats.incomeTransactions.toString()],
      ['Expense Transactions', stats.expenseTransactions.toString()]
    ];
    
    pdf.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [90, 183, 166] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = pdf.lastAutoTable.finalY + 20;
  }
  
  // Category Breakdown
  if (reportType === 'detailed') {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Category Breakdown', 20, yPosition);
    yPosition += 15;
    
    // Income Categories
    const incomeCategories = {};
    const expenseCategories = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeCategories[transaction.category] = 
          (incomeCategories[transaction.category] || 0) + transaction.amount;
      } else {
        expenseCategories[transaction.category] = 
          (expenseCategories[transaction.category] || 0) + transaction.amount;
      }
    });
    
    const categoryData = [
      ...Object.entries(incomeCategories).map(([category, amount]) => 
        [category, 'Income', formatCurrency(amount)]
      ),
      ...Object.entries(expenseCategories).map(([category, amount]) => 
        [category, 'Expense', formatCurrency(amount)]
      )
    ];
    
    if (categoryData.length > 0) {
      pdf.autoTable({
        startY: yPosition,
        head: [['Category', 'Type', 'Amount']],
        body: categoryData,
        theme: 'grid',
        headStyles: { fillColor: [90, 183, 166] },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = pdf.lastAutoTable.finalY + 20;
    }
  }
  
  // Transactions Table
  if (reportType === 'detailed' || reportType === 'transactions') {
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Recent Transactions', 20, yPosition);
    yPosition += 15;
    
    const transactionData = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20) // Limit to recent 20 transactions
      .map(transaction => [
        formatDate(transaction.date, 'MM/DD/YY'),
        transaction.type,
        transaction.category,
        transaction.reference,
        formatCurrency(transaction.amount)
      ]);
    
    pdf.autoTable({
      startY: yPosition,
      head: [['Date', 'Type', 'Category', 'Reference', 'Amount']],
      body: transactionData,
      theme: 'grid',
      headStyles: { fillColor: [90, 183, 166] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 }
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const filename = `financial_report_${reportType}_${moment().format('YYYY-MM-DD')}.pdf`;
  pdf.save(filename);
};

// Export chart as image
export const exportChartAsImage = async (chartElementId, filename = 'chart') => {
  const chartElement = document.getElementById(chartElementId);
  if (!chartElement) {
    throw new Error('Chart element not found');
  }
  
  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });
    
    const link = document.createElement('a');
    link.download = `${filename}_${moment().format('YYYY-MM-DD')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    throw new Error('Failed to export chart: ' + error.message);
  }
};

// Export budget report
export const exportBudgetReport = (budgets, transactions) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Budget Report', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${moment().format('MMMM DD, YYYY')}`, pageWidth / 2, 30, { align: 'center' });
  
  let yPosition = 50;
  
  // Budget Summary
  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Budget Overview', 20, yPosition);
  yPosition += 15;
  
  const budgetData = budgets.map(budget => [
    budget.name,
    budget.category,
    formatCurrency(budget.amount),
    formatCurrency(budget.spent),
    formatCurrency(budget.amount - budget.spent),
    `${Math.round((budget.spent / budget.amount) * 100)}%`
  ]);
  
  pdf.autoTable({
    startY: yPosition,
    head: [['Budget Name', 'Category', 'Allocated', 'Spent', 'Remaining', 'Usage %']],
    body: budgetData,
    theme: 'grid',
    headStyles: { fillColor: [90, 183, 166] },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 }
  });
  
  // Save the PDF
  const filename = `budget_report_${moment().format('YYYY-MM-DD')}.pdf`;
  pdf.save(filename);
};

// Export goals report
export const exportGoalsReport = (goals) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Goals Report', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${moment().format('MMMM DD, YYYY')}`, pageWidth / 2, 30, { align: 'center' });
  
  let yPosition = 50;
  
  // Goals Summary
  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Financial Goals Overview', 20, yPosition);
  yPosition += 15;
  
  const goalsData = goals.map(goal => [
    goal.name,
    goal.type,
    formatCurrency(goal.targetAmount),
    formatCurrency(goal.currentAmount),
    formatCurrency(goal.targetAmount - goal.currentAmount),
    `${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%`,
    formatDate(goal.targetDate),
    goal.status
  ]);
  
  pdf.autoTable({
    startY: yPosition,
    head: [['Goal Name', 'Type', 'Target', 'Current', 'Remaining', 'Progress %', 'Target Date', 'Status']],
    body: goalsData,
    theme: 'grid',
    headStyles: { fillColor: [90, 183, 166] },
    styles: { fontSize: 8 },
    margin: { left: 20, right: 20 }
  });
  
  // Save the PDF
  const filename = `goals_report_${moment().format('YYYY-MM-DD')}.pdf`;
  pdf.save(filename);
};
