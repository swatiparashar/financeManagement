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
  Empty,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { formatCurrency, calculateGoalProgress } from '../../utils/helpers';
import { GOAL_TYPES } from '../../constants';
import '../../styles/budget-goals.css';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const GoalsManager = ({ transactions }) => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [form] = Form.useForm();
  const [contributeForm] = Form.useForm();

  // Mock data for demonstration
  useEffect(() => {
    const mockGoals = [
      {
        id: '1',
        name: 'Emergency Fund',
        description: 'Build an emergency fund for unexpected expenses',
        type: 'emergency',
        targetAmount: 5000,
        currentAmount: 2500,
        targetDate: moment().add(6, 'months').toDate(),
        createdDate: moment().subtract(2, 'months').toDate(),
        status: 'active'
      },
      {
        id: '2',
        name: 'Vacation to Europe',
        description: 'Save for a 2-week vacation to Europe',
        type: 'vacation',
        targetAmount: 3000,
        currentAmount: 1200,
        targetDate: moment().add(8, 'months').toDate(),
        createdDate: moment().subtract(1, 'month').toDate(),
        status: 'active'
      },
      {
        id: '3',
        name: 'New Car Down Payment',
        description: 'Save for down payment on a new car',
        type: 'car',
        targetAmount: 8000,
        currentAmount: 8000,
        targetDate: moment().subtract(1, 'month').toDate(),
        createdDate: moment().subtract(10, 'months').toDate(),
        status: 'completed'
      }
    ];
    setGoals(mockGoals);
  }, []);

  const handleAddGoal = () => {
    setEditingGoal(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      ...goal,
      targetDate: moment(goal.targetDate)
    });
    setShowModal(true);
  };

  const handleDeleteGoal = (goalId) => {
    Modal.confirm({
      title: 'Delete Goal',
      content: 'Are you sure you want to delete this goal?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setGoals(goals.filter(g => g.id !== goalId));
        message.success('Goal deleted successfully');
      }
    });
  };

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    contributeForm.resetFields();
    setShowContributeModal(true);
  };

  const handleSubmitGoal = (values) => {
    const goalData = {
      ...values,
      id: editingGoal ? editingGoal.id : Date.now().toString(),
      targetDate: values.targetDate.toDate(),
      currentAmount: editingGoal ? editingGoal.currentAmount : 0,
      createdDate: editingGoal ? editingGoal.createdDate : new Date(),
      status: 'active'
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g));
      message.success('Goal updated successfully');
    } else {
      setGoals([...goals, goalData]);
      message.success('Goal created successfully');
    }

    setShowModal(false);
    form.resetFields();
  };

  const handleSubmitContribution = (values) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newAmount = goal.currentAmount + values.amount;
        const isCompleted = newAmount >= goal.targetAmount;
        return {
          ...goal,
          currentAmount: newAmount,
          status: isCompleted ? 'completed' : 'active'
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    message.success(`${formatCurrency(values.amount)} added to ${selectedGoal.name}`);
    setShowContributeModal(false);
    contributeForm.resetFields();
  };

  const getGoalIcon = (type) => {
    const iconMap = {
      emergency: '🚨',
      vacation: '✈️',
      car: '🚗',
      home: '🏠',
      education: '🎓',
      retirement: '👴',
      other: '🎯'
    };
    return iconMap[type] || '🎯';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'active':
        return '#1890ff';
      case 'paused':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

  const getTimeRemaining = (targetDate) => {
    const now = moment();
    const target = moment(targetDate);
    const diff = target.diff(now);
    
    if (diff <= 0) return 'Overdue';
    
    const duration = moment.duration(diff);
    const months = duration.asMonths();
    const days = duration.asDays();
    
    if (months >= 1) {
      return `${Math.floor(months)} month${Math.floor(months) !== 1 ? 's' : ''} left`;
    } else {
      return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''} left`;
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="goals-manager">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Financial Goals</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddGoal}
          style={{ borderRadius: '6px' }}
        >
          Create Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Empty
          description="No financial goals set yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={handleAddGoal}>
            Set Your First Goal
          </Button>
        </Empty>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <>
              <h3 style={{ marginBottom: '16px' }}>Active Goals</h3>
              <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                {activeGoals.map((goal) => {
                  const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);
                  const remaining = goal.targetAmount - goal.currentAmount;
                  const timeRemaining = getTimeRemaining(goal.targetDate);

                  return (
                    <Col xs={24} sm={12} lg={8} key={goal.id}>
                      <Card
                        className="goal-card"
                        style={{ borderRadius: '12px' }}
                        actions={[
                          <Tooltip title="Add Money">
                            <PlusCircleOutlined onClick={() => handleContribute(goal)} />
                          </Tooltip>,
                          <Tooltip title="Edit Goal">
                            <EditOutlined onClick={() => handleEditGoal(goal)} />
                          </Tooltip>,
                          <Tooltip title="Delete Goal">
                            <DeleteOutlined onClick={() => handleDeleteGoal(goal.id)} />
                          </Tooltip>
                        ]}
                      >
                        <div className="goal-header">
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px', marginRight: '8px' }}>
                              {getGoalIcon(goal.type)}
                            </span>
                            <h4 style={{ margin: 0, fontSize: '16px', flex: 1 }}>{goal.name}</h4>
                          </div>
                          <p style={{ color: '#666', margin: '4px 0', fontSize: '12px' }}>
                            {goal.description}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <Tag color={getStatusColor(goal.status)}>
                              <CalendarOutlined /> {timeRemaining}
                            </Tag>
                          </div>
                        </div>

                        <div className="goal-progress" style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                            </span>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          
                          <Progress
                            percent={Math.min(progress, 100)}
                            strokeColor="#52c41a"
                            showInfo={false}
                            strokeWidth={8}
                          />
                          
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            {formatCurrency(remaining)} remaining to reach goal
                          </div>

                          <Button
                            type="primary"
                            size="small"
                            icon={<DollarOutlined />}
                            onClick={() => handleContribute(goal)}
                            style={{ marginTop: '12px', width: '100%' }}
                          >
                            Add Money
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <>
              <h3 style={{ marginBottom: '16px' }}>
                <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                Completed Goals
              </h3>
              <Row gutter={[16, 16]}>
                {completedGoals.map((goal) => (
                  <Col xs={24} sm={12} lg={8} key={goal.id}>
                    <Card
                      className="goal-card completed"
                      style={{ 
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
                        border: '1px solid #52c41a'
                      }}
                    >
                      <div className="goal-header">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px', marginRight: '8px' }}>
                            {getGoalIcon(goal.type)}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '16px', flex: 1 }}>{goal.name}</h4>
                          <TrophyOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                        </div>
                        <p style={{ color: '#666', margin: '4px 0', fontSize: '12px' }}>
                          {goal.description}
                        </p>
                        <Tag color="success">
                          Goal Achieved! 🎉
                        </Tag>
                      </div>

                      <div className="goal-progress" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {formatCurrency(goal.targetAmount)}
                          </span>
                          <span style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                            100%
                          </span>
                        </div>
                        
                        <Progress
                          percent={100}
                          strokeColor="#52c41a"
                          showInfo={false}
                          strokeWidth={8}
                        />
                        
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                          Goal completed! 🎯
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}

      {/* Create/Edit Goal Modal */}
      <Modal
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitGoal}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="Goal Name"
            rules={[{ required: true, message: 'Please enter goal name' }]}
          >
            <Input placeholder="e.g., Emergency Fund" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Describe your financial goal..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Goal Type"
                rules={[{ required: true, message: 'Please select goal type' }]}
              >
                <Select placeholder="Select goal type">
                  {GOAL_TYPES.map(type => (
                    <Option key={type.value} value={type.value}>{type.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="targetAmount"
                label="Target Amount"
                rules={[
                  { required: true, message: 'Please enter target amount' },
                  { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="$"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="targetDate"
            label="Target Date"
            rules={[{ required: true, message: 'Please select target date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Contribute Money Modal */}
      <Modal
        title={`Add Money to ${selectedGoal?.name}`}
        open={showContributeModal}
        onCancel={() => setShowContributeModal(false)}
        footer={null}
        width={400}
      >
        <Form
          form={contributeForm}
          layout="vertical"
          onFinish={handleSubmitContribution}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="amount"
            label="Amount to Add"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="$"
              placeholder="0.00"
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setShowContributeModal(false)} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Money
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoalsManager;
