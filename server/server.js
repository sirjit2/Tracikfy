const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())

// Routes (to be added)
app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/expenses', require('./routes/expenseRoutes'))
app.use('/api/budgets',  require('./routes/budgetRoutes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Trackify API' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Trackify server running on port ${PORT}`))
