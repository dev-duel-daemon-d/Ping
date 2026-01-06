import express from 'express'
import Game from '../models/Game.js'

const router = express.Router()

// @route   GET /api/games
// @desc    Get all supported games
// @access  Public
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().sort({ name: 1 })
        res.json(games)
    } catch (error) {
        console.error('Get games error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router