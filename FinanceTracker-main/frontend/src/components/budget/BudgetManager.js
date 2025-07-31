import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Tooltip,
  Empty
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { formatCurrency, calculateBudgetProgress, getBudgetStatus } from '../../utils/helpers';
import { EXPENSE_CATEGORIES, BUDGET_PERIODS } from '../../constants';
import '../../styles/budget-goals.css';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const BudgetManager = ({ transactions }) => {
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [form] = Form.useForm();

  // Mock data for demonstration - in real app, this would come from API
  useEffect(() => {
    const mockBudgets = [
      {
        id: '1',
        name: 'Monthly Food Budget',
        category: 'Food',
        amount: 500,
        period: 'monthly',
        startDate: moment().startOf('month').toDate(),
        endDate: moment().endOf('month').toDate(),
        spent: 320,
        status: 'good'
      },
      {
        id: '2',
        name: 'Transportation Budget',
        category: 'Transportation',
        amount: 200,
        period: 'monthly',
        startDate: moment().startOf('month').toDate(),
        endDate: moment().endOf('month').toDate(),
        spent: 180,
        status: 'warning'
      }
    ];
    setBudgets(mockBudgets);
  }, []);

  // Calculate spent amount for a budget based on transactions
  const calculateSpentAmount = (budget) => {
    const startDate = moment(budget.startDate);
    const endDate = moment(budget.endDate);
    
    return transactions
      .filter(transaction => 
        transaction.type === 'expense' &&
        transaction.category === budget.category &&
        moment(transaction.date).isBetween(startDate, endDate, 'day', '[]')
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Update budget spent amounts based on transactions
  useEffect(() => {
    setBudgets(prevBudgets => 
      prevBudgets.map(budget => {
        const spent = calculateSpentAmount(budget);
        const status = getBudgetStatus(spent, budget.amount);
        return { ...budget, spent, status };
      })
    );
  }, [transactions]);

  const handleAddBudget = () => {
    setEditingBudget(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    form.setFieldsValue({
      ...budget,
      dateRange: [moment(budget.startDate), moment(budget.endDate)]
    });
    setShowModal(true);
  };

  const handleDeleteBudget = (budgetId) => {
    Modal.confirm({
      title: 'Delete Budget',
      content: 'Are you sure you want to delete this budget?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setBudgets(budgets.filter(b => b.id !== budgetId));
        message.success('Budget deleted successfully');
      }
    });
  };

  const handleSubmit = (values) => {
    const budgetData = {
      ...values,
      id: editingBudget ? editingBudget.id : Date.now().toString(),
      startDate: values.dateRange[0].toDate(),
      endDate: values.dateRange[1].toDate(),
      spent: editingBudget ? editingBudget.spent : 0,
      status: 'excellent'
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? budgetData : b));
      message.success('Budget updated successfully');
    } else {
      setBudgets([...budgets, budgetData]);
      message.success('Budget created successfully');
    }

    setShowModal(false);
    form.resetFields();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'good':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'exceeded':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return '#52c41a';
      case 'good':
        return '#1890ff';
      case 'warning':
        return '#faad14';
      case 'exceeded':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'warning':
        return 'Warning';
      case 'exceeded':
        return 'Exceeded';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="budget-manager">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Budget Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddBudget}
          style={{ borderRadius: '6px' }}
        >
          Create Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Empty
          description="No budgets created yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={handleAddBudget}>
            Create Your First Budget
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {budgets.map((budget) => {
            const progress = calculateBudgetProgress(budget.spent, budget.amount);
            const remaining = Math.max(0, budget.amount - budget.spent);
            const isOverBudget = budget.spent > budget.amount;

            return (
              <Col xs={24} sm={12} lg={8} key={budget.id}>
                <Card
                  className="budget-card"
                  style={{ borderRadius: '12px' }}
                  actions={[
                    <Tooltip title="Edit Budget">
                      <EditOutlined onClick={() => handleEditBudget(budget)} />
                    </Tooltip>,
                    <Tooltip title="Delete Budget">
                      <DeleteOutlined onClick={() => handleDeleteBudget(budget.id)} />
                    </Tooltip>
                  ]}
                >
                  <div className="budget-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>{budget.name}</h4>
                      <Tag color={getStatusColor(budget.status)}>
                        {getStatusIcon(budget.status)} {getStatusText(budget.status)}
                      </Tag>
                    </div>
                    <p style={{ color: '#666', margin: '4px 0' }}>Category: {budget.category}</p>
                    <p style={{ color: '#666', margin: '4px 0', fontSize: '12px' }}>
                      {moment(budget.startDate).format('MMM DD')} - {moment(budget.endDate).format('MMM DD, YYYY')}
                    </p>
                  </div>

                  <div className="budget-progress" style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    
                    <Progress
                      percent={Math.min(progress, 100)}
                      strokeColor={getStatusColor(budget.status)}
                      showInfo={false}
                      strokeWidth={8}
                    />
                    
                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                      {isOverBudget ? (
                        <span style={{ color: '#ff4d4f' }}>
                          Over budget by {formatCurrency(budget.spent - budget.amount)}
                        </span>
                      ) : (
                        <span style={{ color: '#52c41a' }}>
                          {formatCurrency(remaining)} remaining
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="Budget Name"
            rules={[{ required: true, message: 'Please enter budget name' }]}
          >
            <Input placeholder="e.g., Monthly Food Budget" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {EXPENSE_CATEGORIES.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Budget Amount"
                rules={[
                  { required: true, message: 'Please enter budget amount' },
                  { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
                ]}
              >
                <Input type="number" prefix="$" placeholder="0.00" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dateRange"
            label="Budget Period"
            rules={[{ required: true, message: 'Please select budget period' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BudgetManager;
