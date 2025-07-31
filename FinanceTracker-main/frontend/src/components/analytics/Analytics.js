import React from 'react'
import '../../styles/analytics.css'
import { Progress, Row, Col, Card } from 'antd'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/helpers'
import moment from 'moment'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

function Analytics({ transactions }) {
    const totalTransactions = transactions.length
    const totalIncomeTransactions = transactions.filter(transaction => transaction.type === 'income')
    const totalExpenseTransactions = transactions.filter(transaction => transaction.type === 'expense')
    const totalIncomeTransactionsPercentage = totalTransactions > 0 ? (totalIncomeTransactions.length / totalTransactions) * 100 : 0
    const totalExpenseTransactionsPercentage = totalTransactions > 0 ? (totalExpenseTransactions.length / totalTransactions) * 100 : 0

    const totalTurnover = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
    const totalIncomeTurnover = transactions.filter(transaction => transaction.type === 'income').reduce((acc, transaction) => acc + transaction.amount, 0)
    const totalExpenseTurnover = transactions.filter(transaction => transaction.type === 'expense').reduce((acc, transaction) => acc + transaction.amount, 0)
    const totalIncomeTurnoverPercentage = totalTurnover > 0 ? (totalIncomeTurnover / totalTurnover) * 100 : 0
    const totalExpenseTurnoverPercentage = totalTurnover > 0 ? (totalExpenseTurnover / totalTurnover) * 100 : 0

    const categories = ['Salary', 'Freelance', 'Food', 'Entertainment', 'Travel', 'Education', 'Medical', 'Shopping', 'Bills', 'Transportation', 'Investment', 'Business', 'Rental', 'Gift', 'Utilities', 'Insurance', 'Other Income', 'Other Expense']

    // Prepare data for charts
    const getMonthlyData = () => {
        const monthlyData = {}
        transactions.forEach(transaction => {
            const month = moment(transaction.date).format('MMM YYYY')
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 }
            }
            monthlyData[month][transaction.type] += transaction.amount
        })

        const sortedMonths = Object.keys(monthlyData).sort((a, b) => moment(a, 'MMM YYYY') - moment(b, 'MMM YYYY'))
        return {
            labels: sortedMonths,
            income: sortedMonths.map(month => monthlyData[month].income),
            expense: sortedMonths.map(month => monthlyData[month].expense)
        }
    }

    const getCategoryData = (type) => {
        const categoryData = {}
        transactions.filter(t => t.type === type).forEach(transaction => {
            categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount
        })
        return categoryData
    }

    const monthlyData = getMonthlyData()
    const incomeCategories = getCategoryData('income')
    const expenseCategories = getCategoryData('expense')

    // Chart configurations
    const monthlyChartData = {
        labels: monthlyData.labels,
        datasets: [
            {
                label: 'Income',
                data: monthlyData.income,
                backgroundColor: 'rgba(82, 196, 26, 0.6)',
                borderColor: 'rgba(82, 196, 26, 1)',
                borderWidth: 2,
            },
            {
                label: 'Expense',
                data: monthlyData.expense,
                backgroundColor: 'rgba(255, 77, 79, 0.6)',
                borderColor: 'rgba(255, 77, 79, 1)',
                borderWidth: 2,
            }
        ]
    }

    const incomePieData = {
        labels: Object.keys(incomeCategories),
        datasets: [
            {
                data: Object.values(incomeCategories),
                backgroundColor: [
                    '#52c41a', '#1890ff', '#722ed1', '#eb2f96', '#fa8c16',
                    '#13c2c2', '#faad14', '#f5222d', '#a0d911', '#096dd9'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }
        ]
    }

    const expensePieData = {
        labels: Object.keys(expenseCategories),
        datasets: [
            {
                data: Object.values(expenseCategories),
                backgroundColor: [
                    '#ff4d4f', '#ff7a45', '#ffa940', '#ffec3d', '#bae637',
                    '#73d13d', '#40a9ff', '#597ef7', '#9254de', '#f759ab'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y || context.parsed)}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value)
                    }
                }
            }
        }
    }

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((context.parsed / total) * 100).toFixed(1)
                        return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`
                    }
                }
            }
        }
    }

    return (
        <div className='analytics'>
            <Row gutter={[16, 16]}>
                {/* Summary Cards */}
                <Col xs={24} md={8}>
                    <Card title="Transaction Summary" className="analytics-card">
                        <div className="summary-item">
                            <h4>Total Transactions: {totalTransactions}</h4>
                            <div className="summary-details">
                                <p>Income: {totalIncomeTransactions.length}</p>
                                <p>Expense: {totalExpenseTransactions.length}</p>
                            </div>
                            <div className="progress-bars">
                                <Progress
                                    type='circle'
                                    percent={Math.round(totalIncomeTransactionsPercentage)}
                                    strokeColor='#52c41a'
                                    size={80}
                                    format={() => `${Math.round(totalIncomeTransactionsPercentage)}%`}
                                />
                                <Progress
                                    type='circle'
                                    percent={Math.round(totalExpenseTransactionsPercentage)}
                                    strokeColor='#ff4d4f'
                                    size={80}
                                    format={() => `${Math.round(totalExpenseTransactionsPercentage)}%`}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Financial Overview" className="analytics-card">
                        <div className="summary-item">
                            <h4>Total Turnover: {formatCurrency(totalTurnover)}</h4>
                            <div className="summary-details">
                                <p>Income: {formatCurrency(totalIncomeTurnover)}</p>
                                <p>Expense: {formatCurrency(totalExpenseTurnover)}</p>
                            </div>
                            <div className="progress-bars">
                                <Progress
                                    type='circle'
                                    percent={Math.round(totalIncomeTurnoverPercentage)}
                                    strokeColor='#52c41a'
                                    size={80}
                                    format={() => `${Math.round(totalIncomeTurnoverPercentage)}%`}
                                />
                                <Progress
                                    type='circle'
                                    percent={Math.round(totalExpenseTurnoverPercentage)}
                                    strokeColor='#ff4d4f'
                                    size={80}
                                    format={() => `${Math.round(totalExpenseTurnoverPercentage)}%`}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Net Balance" className="analytics-card">
                        <div className="summary-item">
                            <h4 style={{ color: totalIncomeTurnover - totalExpenseTurnover >= 0 ? '#52c41a' : '#ff4d4f' }}>
                                {formatCurrency(totalIncomeTurnover - totalExpenseTurnover)}
                            </h4>
                            <div className="summary-details">
                                <p>Savings Rate: {totalIncomeTurnover > 0 ?
                                    `${(((totalIncomeTurnover - totalExpenseTurnover) / totalIncomeTurnover) * 100).toFixed(1)}%` :
                                    '0%'
                                }</p>
                            </div>
                            <Progress
                                percent={totalIncomeTurnover > 0 ?
                                    Math.max(0, Math.min(100, ((totalIncomeTurnover - totalExpenseTurnover) / totalIncomeTurnover) * 100)) :
                                    0
                                }
                                strokeColor={totalIncomeTurnover - totalExpenseTurnover >= 0 ? '#52c41a' : '#ff4d4f'}
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                {/* Monthly Trend Chart */}
                <Col span={24}>
                    <Card title="Monthly Income vs Expense Trend" className="analytics-card">
                        {monthlyData.labels.length > 0 ? (
                            <Bar data={monthlyChartData} options={chartOptions} height={80} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>No data available for chart</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                {/* Income Categories Pie Chart */}
                <Col xs={24} lg={12}>
                    <Card title="Income by Category" className="analytics-card">
                        {Object.keys(incomeCategories).length > 0 ? (
                            <Pie data={incomePieData} options={pieOptions} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>No income data available</p>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Expense Categories Pie Chart */}
                <Col xs={24} lg={12}>
                    <Card title="Expenses by Category" className="analytics-card">
                        {Object.keys(expenseCategories).length > 0 ? (
                            <Pie data={expensePieData} options={pieOptions} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>No expense data available</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Category Breakdown */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Income Categories" className="analytics-card">
                        <div className="category-analysis">
                            {Object.entries(incomeCategories).map(([category, amount]) => (
                                <div key={category} className='category-card'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>{category}</span>
                                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(amount)}</span>
                                    </div>
                                    <Progress
                                        percent={totalIncomeTurnover > 0 ? Math.round((amount / totalIncomeTurnover) * 100) : 0}
                                        strokeColor="#52c41a"
                                        showInfo={false}
                                    />
                                </div>
                            ))}
                            {Object.keys(incomeCategories).length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999' }}>No income categories found</p>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Expense Categories" className="analytics-card">
                        <div className="category-analysis">
                            {Object.entries(expenseCategories).map(([category, amount]) => (
                                <div key={category} className='category-card'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>{category}</span>
                                        <span style={{ fontWeight: 'bold' }}>{formatCurrency(amount)}</span>
                                    </div>
                                    <Progress
                                        percent={totalExpenseTurnover > 0 ? Math.round((amount / totalExpenseTurnover) * 100) : 0}
                                        strokeColor="#ff4d4f"
                                        showInfo={false}
                                    />
                                </div>
                            ))}
                            {Object.keys(expenseCategories).length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999' }}>No expense categories found</p>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Analytics
