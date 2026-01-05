import express from 'express'
import Tournament from '../models/Tournament.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/tournaments
// @desc    Get all tournaments
// @access  Public
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find({ status: { $ne: 'cancelled' } })
            .sort({ startDate: 1 })
            .populate('organizer', 'username avatar')
        res.json(tournaments)
    } catch (error) {
        console.error('Get tournaments error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('organizer', 'username avatar')
            .populate('participants', 'username avatar')
        
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' })
        }
        res.json(tournament)
    } catch (error) {
        console.error('Get tournament error:', error)
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Tournament not found' })
        }
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   POST /api/tournaments
// @desc    Create a tournament
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const tournament = await Tournament.create({
            ...req.body,
            organizer: req.user._id
        })
        res.status(201).json(tournament)
    } catch (error) {
        console.error('Create tournament error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   POST /api/tournaments/:id/join
// @desc    Join a tournament
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' })
        }

        if (tournament.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already joined this tournament' })
        }

        if (tournament.participants.length >= tournament.maxParticipants) {
            return res.status(400).json({ message: 'Tournament is full' })
        }

        tournament.participants.push(req.user._id)
        await tournament.save()

        res.json({ message: 'Joined successfully', tournament })
    } catch (error) {
        console.error('Join tournament error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
