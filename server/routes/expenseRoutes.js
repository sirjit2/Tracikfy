const express = require('express')
const router = express.Router()

// GET  /api/expenses
router.get('/',    (req, res) => res.json({ message: 'Get expenses — coming soon' }))
// POST /api/expenses
router.post('/',   (req, res) => res.json({ message: 'Create expense — coming soon' }))
// PUT  /api/expenses/:id
router.put('/:id', (req, res) => res.json({ message: 'Update expense — coming soon' }))
// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => res.json({ message: 'Delete expense — coming soon' }))

module.exports = router
