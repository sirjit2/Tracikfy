const express = require('express')
const router = express.Router()
const Expense = require('../models/Expense')
const { protect } = require('../middleware/authMiddleware')

// All routes require auth
router.use(protect)

// ── GET /api/expenses ─────────────────────────────────────────────────────────
// Optional query params: ?category=Food&month=6&year=2025
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id }
    if (req.query.category) filter.category = req.query.category
    if (req.query.month && req.query.year) {
      const month = parseInt(req.query.month)
      const year  = parseInt(req.query.year)
      filter.date = {
        $gte: new Date(year, month, 1),
        $lt:  new Date(year, month + 1, 1),
      }
    }
    const expenses = await Expense.find(filter).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── POST /api/expenses ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'Title, amount, category and date are required' })
    }
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      note: note || '',
    })
    res.status(201).json(expense)
  } catch (err) {
    console.error(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

// ── PUT /api/expenses/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    const { title, amount, category, date, note } = req.body
    if (title)    expense.title    = title
    if (amount)   expense.amount   = Number(amount)
    if (category) expense.category = category
    if (date)     expense.date     = new Date(date)
    if (note !== undefined) expense.note = note

    const updated = await expense.save()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ── DELETE /api/expenses/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    res.json({ message: 'Expense deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
