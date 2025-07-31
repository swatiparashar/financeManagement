import React, { useState } from 'react';
import { Modal, Button, Select, Radio, message, Divider, Space, Typography } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, PictureOutlined } from '@ant-design/icons';
import { exportToCSV, exportToPDF, exportBudgetReport, exportGoalsReport, exportChartAsImage } from '../../utils/exportUtils';
import { calculateTransactionStats } from '../../utils/helpers';

const { Option } = Select;
const { Title, Text } = Typography;

const ExportModal = ({ visible, onCancel, transactions, budgets = [], goals = [] }) => {
  const [exportType, setExportType] = useState('csv');
  const [reportType, setReportType] = useState('summary');
  // const [dateRange, setDateRange] = useState('all'); // TODO: Implement date range filtering
  const [loading, setLoading] = useState(false);

  const stats = calculateTransactionStats(transactions);

  const handleExport = async () => {
    if (!transactions || transactions.length === 0) {
      message.warning('No data available to export');
      return;
    }

    setLoading(true);
    
    try {
      switch (exportType) {
        case 'csv':
          await exportToCSV(transactions, 'transactions');
          message.success('CSV file downloaded successfully!');
          break;
          
        case 'pdf':
          await exportToPDF(transactions, stats, reportType);
          message.success('PDF report generated successfully!');
          break;
          
        case 'budget':
          if (budgets.length === 0) {
            message.warning('No budget data available to export');
            return;
          }
          await exportBudgetReport(budgets, transactions);
          message.success('Budget report generated successfully!');
          break;
          
        case 'goals':
          if (goals.length === 0) {
            message.warning('No goals data available to export');
            return;
          }
          await exportGoalsReport(goals);
          message.success('Goals report generated successfully!');
          break;
          
        case 'chart':
          // Try to export analytics chart if available
          try {
            await exportChartAsImage('analytics-chart', 'financial_chart');
            message.success('Chart exported successfully!');
          } catch (error) {
            message.error('No chart available to export. Please visit the Analytics tab first.');
          }
          break;
          
        default:
          message.error('Invalid export type selected');
      }
      
      onCancel();
    } catch (error) {
      console.error('Export error:', error);
      message.error(error.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const getExportDescription = () => {
    switch (exportType) {
      case 'csv':
        return 'Export transaction data in CSV format for use in spreadsheet applications';
      case 'pdf':
        return `Generate a ${reportType} PDF report with financial insights and data`;
      case 'budget':
        return 'Export budget analysis and spending patterns in PDF format';
      case 'goals':
        return 'Export financial goals progress and status in PDF format';
      case 'chart':
        return 'Export analytics charts as high-quality PNG images';
      default:
        return '';
    }
  };

  return (
    <Modal
      title={
        <Space>
          <DownloadOutlined />
          <span>Export Financial Data</span>
        </Space>
      }
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          loading={loading}
          onClick={handleExport}
          disabled={!transactions || transactions.length === 0}
        >
          Export Data
        </Button>,
      ]}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        <Title level={4}>Select Export Format</Title>
        
        <Radio.Group
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          style={{ width: '100%', marginBottom: 24 }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="csv">
              <Space>
                <FileExcelOutlined style={{ color: '#52c41a' }} />
                <span>CSV Export</span>
              </Space>
            </Radio>
            
            <Radio value="pdf">
              <Space>
                <FilePdfOutlined style={{ color: '#ff4d4f' }} />
                <span>PDF Report</span>
              </Space>
            </Radio>
            
            <Radio value="budget">
              <Space>
                <FilePdfOutlined style={{ color: '#1890ff' }} />
                <span>Budget Report</span>
              </Space>
            </Radio>
            
            <Radio value="goals">
              <Space>
                <FilePdfOutlined style={{ color: '#722ed1' }} />
                <span>Goals Report</span>
              </Space>
            </Radio>
            
            <Radio value="chart">
              <Space>
                <PictureOutlined style={{ color: '#fa8c16' }} />
                <span>Chart Export</span>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>

        {exportType === 'pdf' && (
          <>
            <Divider />
            <Title level={5}>Report Type</Title>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: '100%', marginBottom: 16 }}
            >
              <Option value="summary">Summary Report</Option>
              <Option value="detailed">Detailed Report</Option>
              <Option value="transactions">Transactions Only</Option>
            </Select>
          </>
        )}

        <Divider />
        <div style={{ backgroundColor: '#f6f6f6', padding: 16, borderRadius: 6 }}>
          <Text type="secondary">{getExportDescription()}</Text>
        </div>

        {transactions && transactions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Data Summary:</Text>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>{transactions.length} transactions</li>
              <li>Total Income: ₹{stats.totalIncome?.toLocaleString() || 0}</li>
              <li>Total Expenses: ₹{stats.totalExpenses?.toLocaleString() || 0}</li>
              <li>Net Balance: ₹{stats.balance?.toLocaleString() || 0}</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExportModal;
