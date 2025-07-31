import React from 'react';
import { Card, List, Tag, Button, Empty, Avatar } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  GiftOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../utils/helpers';
import moment from 'moment';

const RecentTransactions = ({ transactions, loading, onViewAll, onEdit }) => {
  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': <ShoppingCartOutlined />,
      'Transportation': <CarOutlined />,
      'Shopping': <ShoppingCartOutlined />,
      'Bills': <HomeOutlined />,
      'Medical': <MedicineBoxOutlined />,
      'Education': <BookOutlined />,
      'Gift': <GiftOutlined />,
      'Salary': <DollarOutlined />,
      'Freelance': <DollarOutlined />,
      'Investment': <ArrowUpOutlined />,
      'Business': <DollarOutlined />,
    };
    return iconMap[category] || <DollarOutlined />;
  };

  // Get transaction color based on type
  const getTransactionColor = (type) => {
    return type === 'income' ? '#52c41a' : '#ff4d4f';
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    return type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  // Format transaction for display
  const formatTransaction = (transaction) => {
    const isIncome = transaction.type === 'income';
    const color = getTransactionColor(transaction.type);
    const icon = getTransactionIcon(transaction.type);
    
    return {
      ...transaction,
      displayAmount: `${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}`,
      color,
      icon,
      categoryIcon: getCategoryIcon(transaction.category),
      timeAgo: moment(transaction.date).fromNow(),
      formattedDate: formatDate(transaction.date)
    };
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(formatTransaction);

  return (
    <Card
      title="Recent Transactions"
      className="recent-transactions-card"
      style={{ borderRadius: '12px' }}
      extra={
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={onViewAll}
          style={{ padding: 0 }}
        >
          View All
        </Button>
      }
    >
      {recentTransactions.length === 0 ? (
        <Empty
          description="No transactions yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '40px 0' }}
        />
      ) : (
        <List
          loading={loading}
          dataSource={recentTransactions}
          renderItem={(transaction) => (
            <List.Item
              className="transaction-item"
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => onEdit && onEdit(transaction)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: transaction.color,
                      color: 'white'
                    }}
                    icon={transaction.categoryIcon}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {transaction.reference}
                      </span>
                      <Tag
                        color={transaction.type === 'income' ? 'green' : 'red'}
                        style={{ marginLeft: '8px', fontSize: '10px' }}
                      >
                        {transaction.category}
                      </Tag>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: transaction.color,
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {transaction.displayAmount}
                      </div>
                    </div>
                  </div>
                }
                description={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      {transaction.description}
                    </span>
                    <span style={{ color: '#999', fontSize: '11px' }}>
                      {transaction.timeAgo}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      
      {recentTransactions.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          paddingTop: '16px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            type="primary" 
            ghost 
            onClick={onViewAll}
            style={{ borderRadius: '6px' }}
          >
            View All Transactions
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;
