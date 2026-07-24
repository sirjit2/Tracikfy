const express = require('express')
const router = express.Router()
const Budget = require('../models/Budget')
const { protect } = require('../middleware/authMiddleware')

// All routes require auth
router.use(protect)

// ── GET /api/budgets ──────────────────────────────────────────────────────────
// Optional: ?month=6&year=2025 (defaults to current month)
router.get('/', async (req, res) => {
  try {
    const now   = new Date()
    const month = req.query.month !== undefined ? parseInt(req.query.month) : now.getMonth()
    const year  = req.query.year  !== undefined ? parseInt(req.query.year)  : now.getFullYear()

    const budgets = await Budget.find({ user: req.user._id, month, year })
    res.json(budgets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── POST /api/budgets ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const now = new Date()
    const { category, limit, month = now.getMonth(), year = now.getFullYear() } = req.body

    if (!category || !limit) {
      return res.status(400).json({ message: 'Category and limit are required' })
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit: Number(limit),
      month: Number(month),
      year:  Number(year),
    })
    res.status(201).json(budget)
  } catch (err) {
    console.error(err)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A budget for this category already exists this month' })
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

// ── PUT /api/budgets/:id ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id })
    if (!budget) return res.status(404).json({ message: 'Budget not found' })

    if (req.body.limit)    budget.limit    = Number(req.body.limit)
    if (req.body.category) budget.category = req.body.category

    const updated = await budget.save()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── DELETE /api/budgets/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!budget) return res.status(404).json({ message: 'Budget not found' })
    res.json({ message: 'Budget deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
