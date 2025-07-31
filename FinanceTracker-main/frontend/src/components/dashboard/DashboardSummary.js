
import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tooltip } from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
  PieChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { formatCurrency, formatPercentage } from '../../utils/helpers';
import '../../styles/dashboard.css';

const DashboardSummary = ({ stats, loading }) => {
  if (!stats) return null;

  const {
    totalIncome,
    totalExpense,
    totalBalance,
    incomePercentage,
    expensePercentage,
    totalTransactions
  } = stats;

  const balanceColor = totalBalance >= 0 ? '#52c41a' : '#ff4d4f';
  const balanceIcon = totalBalance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;

  const summaryCards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      prefix: balanceIcon,
      valueStyle: { color: balanceColor },
      suffix: '',
      description: 'Current financial position',
      color: totalBalance >= 0 ? '#52c41a' : '#ff4d4f',
      gradient: totalBalance >= 0 
        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        : 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)'
    },
    {
      title: 'Total Income',
      value: totalIncome,
      prefix: <ArrowUpOutlined />,
      valueStyle: { color: '#52c41a' },
      suffix: '',
      description: `${formatPercentage(incomePercentage)} of transactions`,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Total Expenses',
      value: totalExpense,
      prefix: <ArrowDownOutlined />,
      valueStyle: { color: '#ff4d4f' },
      suffix: '',
      description: `${formatPercentage(expensePercentage)} of transactions`,
      color: '#ff4d4f',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: 'Total Transactions',
      value: totalTransactions,
      prefix: <PieChartOutlined />,
      valueStyle: { color: '#1890ff' },
      suffix: '',
      description: 'All time transactions',
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ];

  return (
    <div className="dashboard-summary">
      <Row gutter={[16, 16]}>
        {summaryCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className="summary-card"
              style={{
                background: card.gradient,
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              loading={loading}
            >
              <div className="summary-card-content">
                <div className="summary-icon" style={{ color: 'white', fontSize: '24px' }}>
                  {card.prefix}
                </div>
                <div className="summary-details">
                  <Statistic
                    title={
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                        {card.title}
                      </span>
                    }
                    value={card.title === 'Total Transactions' ? card.value : formatCurrency(card.value)}
                    valueStyle={{ 
                      color: 'white', 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      lineHeight: '1.2'
                    }}
                    suffix={card.suffix}
                  />
                  <div style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '12px', 
                    marginTop: '4px' 
                  }}>
                    {card.description}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Income vs Expense Progress */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Income vs Expense Ratio" 
            className="progress-card"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#52c41a' }}>Income</span>
                <span style={{ fontWeight: 'bold' }}>{formatPercentage(incomePercentage)}</span>
              </div>
              <Progress 
                percent={incomePercentage} 
                strokeColor="#52c41a" 
                showInfo={false}
                strokeWidth={8}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#ff4d4f' }}>Expenses</span>
                <span style={{ fontWeight: 'bold' }}>{formatPercentage(expensePercentage)}</span>
              </div>
              <Progress 
                percent={expensePercentage} 
                strokeColor="#ff4d4f" 
                showInfo={false}
                strokeWidth={8}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="Financial Health Score" 
            className="health-score-card"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ textAlign: 'center' }}>
              {(() => {
                const healthScore = totalIncome > 0 
                  ? Math.min(((totalIncome - totalExpense) / totalIncome) * 100, 100)
                  : 0;
                const scoreColor = healthScore >= 70 ? '#52c41a' : 
                                 healthScore >= 40 ? '#faad14' : '#ff4d4f';
                const scoreLabel = healthScore >= 70 ? 'Excellent' :
                                 healthScore >= 40 ? 'Good' : 'Needs Improvement';

                return (
                  <>
                    <Progress
                      type="circle"
                      percent={Math.max(healthScore, 0)}
                      strokeColor={scoreColor}
                      size={120}
                      format={() => (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: scoreColor }}>
                            {Math.round(Math.max(healthScore, 0))}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Score</div>
                        </div>
                      )}
                    />
                    <div style={{ 
                      marginTop: '16px', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      color: scoreColor 
                    }}>
                      {scoreLabel}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Based on income vs expense ratio
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSummary;
