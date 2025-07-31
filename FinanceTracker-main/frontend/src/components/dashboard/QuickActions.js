import React from 'react';
import { Card, Button, Row, Col, Tooltip } from 'antd';
import {
  PlusOutlined,
  BarChartOutlined,
  DownloadOutlined,
  SettingOutlined,
  WalletOutlined,
  TrophyOutlined,
  FileTextOutlined,
  ExportOutlined
} from '@ant-design/icons';

const QuickActions = ({ 
  onAddTransaction, 
  onViewAnalytics, 
  onExportData, 
  onManageBudgets,
  onManageGoals,
  onGenerateReport 
}) => {
  const quickActions = [
    {
      title: 'Add Transaction',
      description: 'Record income or expense',
      icon: <PlusOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: onAddTransaction,
      primary: true
    },
    {
      title: 'View Analytics',
      description: 'Detailed financial insights',
      icon: <BarChartOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: onViewAnalytics
    },
    {
      title: 'Manage Budgets',
      description: 'Set and track budgets',
      icon: <WalletOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      onClick: onManageBudgets
    },
    {
      title: 'Financial Goals',
      description: 'Track savings goals',
      icon: <TrophyOutlined />,
      color: '#faad14',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      onClick: onManageGoals
    },
    {
      title: 'Generate Report',
      description: 'Create financial reports',
      icon: <FileTextOutlined />,
      color: '#13c2c2',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      onClick: onGenerateReport
    },
    {
      title: 'Export Data',
      description: 'Download CSV/PDF',
      icon: <ExportOutlined />,
      color: '#eb2f96',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      onClick: onExportData
    }
  ];

  return (
    <Card
      title="Quick Actions"
      className="quick-actions-card"
      style={{ borderRadius: '12px' }}
    >
      <Row gutter={[12, 12]}>
        {quickActions.map((action, index) => (
          <Col xs={12} sm={8} lg={6} key={index}>
            <Tooltip title={action.description} placement="top">
              <Button
                className={`quick-action-btn ${action.primary ? 'primary-action' : ''}`}
                style={{
                  width: '100%',
                  height: '80px',
                  background: action.gradient,
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={action.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                  {action.icon}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  textAlign: 'center',
                  lineHeight: '1.2',
                  fontWeight: '500'
                }}>
                  {action.title}
                </div>
              </Button>
            </Tooltip>
          </Col>
        ))}
      </Row>

      {/* Featured Action - Add Transaction */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onAddTransaction}
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '8px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 172, 254, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.3)';
          }}
        >
          Add New Transaction
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
