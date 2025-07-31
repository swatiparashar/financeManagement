const express = require('express')
const dbConnect = require('./src/config/database')
const app = express()

// Connect to database
dbConnect()

// Middleware
app.use(express.json())

// Routes
const userRoute = require('./src/routes/usersRoute')
const transactionsRoute = require('./src/routes/transactionsRoute')
const budgetsRoute = require('./src/routes/budgetsRoute')
const goalsRoute = require('./src/routes/goalsRoute')

// API Routes
app.use('/api/users/', userRoute)
app.use('/api/transactions/', transactionsRoute)
app.use('/api/budgets/', budgetsRoute)
app.use('/api/goals/', goalsRoute)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString()
  })
})

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Finance Tracker server started at port: ${port}`))