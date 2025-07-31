import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/layout/DefaultLayout'
import '../styles/transactions.css'
import '../styles/dashboard.css'
import AddEditTransaction from '../components/transactions/AddEditTransaction'
import { DatePicker, Select, Table, message, Row, Col, Tabs } from 'antd'
import axios from 'axios'
import Spinner from '../components/ui/Spinner'
import moment from 'moment'
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined, DashboardOutlined, WalletOutlined, TrophyOutlined } from '@ant-design/icons';
import Analytics from '../components/analytics/Analytics'
import DashboardSummary from '../components/dashboard/DashboardSummary'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import QuickActions from '../components/dashboard/QuickActions'
import BudgetManager from '../components/budget/BudgetManager'
import GoalsManager from '../components/goals/GoalsManager'
import ExportModal from '../components/common/ExportModal'
import { useTransactions } from '../hooks/useTransactions'
import { calculateTransactionStats } from '../utils/helpers'
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

function Home() {
    const [showAddEditTransactionModal, setShowAddEditTransactionModal] = useState(false)
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
    const [loading, setLoading] = useState(false)
    const [transactionsData, setTransactionsData] = useState([])
    const [frequency, setFrequency] = useState('30')
    const [type, setType] = useState('all')
    const [selectedRange, setSelectedRange] = useState([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [showExportModal, setShowExportModal] = useState(false)

    // Calculate stats for dashboard
    const stats = calculateTransactionStats(transactionsData)


    const getTransactions = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('Lab-Management-User'))

            setLoading(true)
            const response = await axios.post('/api/transactions/get-all-transactions', {
                userid: user._id,
                frequency,
                ...(frequency === 'custom' && { selectedRange }),
                type
            })

            // Handle new API response format
            const transactions = response.data.success ? response.data.data : response.data
            setTransactionsData(transactions)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            message.error(error.response?.data?.error || "Something went wrong")
        }
    }

    const deleteTransaction = async (record) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/transactions/delete-transaction', { transactionId: record._id })

            if (response.data.success) {
                message.success(response.data.message || "Transaction deleted successfully")
            } else {
                message.error(response.data.error || "Failed to delete transaction")
            }

            getTransactions();
            setLoading(false)

        } catch (error) {
            setLoading(false)
            message.error(error.response?.data?.error || "Something went wrong")
        }
    }
    useEffect(() => {
        getTransactions()
    }, [frequency, selectedRange, type])

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
        }, {
            title: "Amount (Rs)",
            dataIndex: "amount"
        }, {
            title: "Type",
            dataIndex: "type"
        }, {
            title: "Category",
            dataIndex: "category"
        }, {
            title: "Reference",
            dataIndex: "reference"
        }, {
            title: "Actions",
            dataIndex: 'actions',
            render: (text, record) => {
                return <div>
                    <EditOutlined onClick={() => {
                        setSelectedItemForEdit(record)
                        setShowAddEditTransactionModal(true)
                    }} />
                    <DeleteOutlined className='mx-3' onClick={() => deleteTransaction(record)} />
                </div>
            }
        }
    ]

    // Quick action handlers
    const handleAddTransaction = () => {
        setSelectedItemForEdit(null)
        setShowAddEditTransactionModal(true)
    }

    const handleViewAnalytics = () => {
        setActiveTab('analytics')
    }

    const handleViewAllTransactions = () => {
        setActiveTab('transactions')
    }

    const handleEditTransaction = (transaction) => {
        setSelectedItemForEdit(transaction)
        setShowAddEditTransactionModal(true)
    }

    const handleExportData = () => {
        setShowExportModal(true)
    }

    const handleManageBudgets = () => {
        setActiveTab('budgets')
    }

    const handleManageGoals = () => {
        setActiveTab('goals')
    }

    const handleGenerateReport = () => {
        window.print()
    }

    return (
        <DefaultLayout>
            {loading && <Spinner />}

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="main-tabs"
                size="large"
            >
                <TabPane
                    tab={
                        <span>
                            <DashboardOutlined />
                            Dashboard
                        </span>
                    }
                    key="dashboard"
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <DashboardSummary stats={stats} loading={loading} />
                        </Col>

                        <Col xs={24} lg={16}>
                            <RecentTransactions
                                transactions={transactionsData}
                                loading={loading}
                                onViewAll={handleViewAllTransactions}
                                onEdit={handleEditTransaction}
                            />
                        </Col>

                        <Col xs={24} lg={8}>
                            <QuickActions
                                onAddTransaction={handleAddTransaction}
                                onViewAnalytics={handleViewAnalytics}
                                onExportData={handleExportData}
                                onManageBudgets={handleManageBudgets}
                                onManageGoals={handleManageGoals}
                                onGenerateReport={handleGenerateReport}
                            />
                        </Col>
                    </Row>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <UnorderedListOutlined />
                            Transactions
                        </span>
                    }
                    key="transactions"
                >
                    <div className="filter d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex">
                            <div className='d-flex flex-column'>
                                <h6 className='no-print'>Select Frequency</h6>
                                <Select value={frequency} onChange={(value) => setFrequency(value)}>
                                    <Select.Option value='7'>Last 1 Week</Select.Option>
                                    <Select.Option value='30'>Last 1 Month</Select.Option>
                                    <Select.Option value='365'>Last 1 Year</Select.Option>
                                    <Select.Option value='custom'>Custom</Select.Option>
                                </Select>

                                {frequency === 'custom' && (
                                    <div className="mt-2">
                                        <RangePicker value={selectedRange} onChange={(values) => setSelectedRange(values)} />
                                    </div>
                                )}
                            </div>
                            <div className='d-flex flex-column mx-5'>
                                <h6 className='no-print'>Select Type</h6>
                                <Select value={type} onChange={(value) => setType(value)}>
                                    <Select.Option value='all'>All</Select.Option>
                                    <Select.Option value='income'>Income</Select.Option>
                                    <Select.Option value='expense'>Expense</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex no-print">
                                <button className="secondary mx-2" onClick={() => window.print()}>Print Report</button>
                                <button className="primary" onClick={handleAddTransaction}>Add New</button>
                            </div>
                        </div>
                    </div>

                    <div className="table">
                        <Table
                            columns={columns}
                            dataSource={transactionsData}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <AreaChartOutlined />
                            Analytics
                        </span>
                    }
                    key="analytics"
                >
                    <Analytics transactions={transactionsData} />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <WalletOutlined />
                            Budgets
                        </span>
                    }
                    key="budgets"
                >
                    <BudgetManager transactions={transactionsData} />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <TrophyOutlined />
                            Goals
                        </span>
                    }
                    key="goals"
                >
                    <GoalsManager transactions={transactionsData} />
                </TabPane>
            </Tabs>

            {showAddEditTransactionModal && (
                <AddEditTransaction
                    showAddEditTransactionModal={showAddEditTransactionModal}
                    setShowAddEditTransactionModal={setShowAddEditTransactionModal}
                    selectedItemForEdit={selectedItemForEdit}
                    getTransactions={getTransactions}
                    setSelectedItemForEdit={setSelectedItemForEdit}
                />
            )}

            {showExportModal && (
                <ExportModal
                    visible={showExportModal}
                    onCancel={() => setShowExportModal(false)}
                    transactions={transactionsData}
                    budgets={[]} // TODO: Add actual budgets data
                    goals={[]} // TODO: Add actual goals data
                />
            )}
        </DefaultLayout>
    )
}

export default Home
