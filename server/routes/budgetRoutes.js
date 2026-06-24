const express = require('express')
const router = express.Router()

// GET  /api/budgets
router.get('/',    (req, res) => res.json({ message: 'Get budgets — coming soon' }))
// POST /api/budgets
router.post('/',   (req, res) => res.json({ message: 'Create budget — coming soon' }))
// PUT  /api/budgets/:id
router.put('/:id', (req, res) => res.json({ message: 'Update budget — coming soon' }))
// DELETE /api/budgets/:id
router.delete('/:id', (req, res) => res.json({ message: 'Delete budget — coming soon' }))

module.exports = router
