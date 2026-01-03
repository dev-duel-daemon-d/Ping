import express from 'express'
import Team from '../models/Team.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/teams
// @desc    Create a team
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, games } = req.body

        const teamExists = await Team.findOne({ name })
        if (teamExists) {
            return res.status(400).json({ message: 'Team name already taken' })
        }

        const team = await Team.create({
            name,
            description,
            games,
            captain: req.user._id,
            members: [req.user._id]
        })

        res.status(201).json(team)
    } catch (error) {
        console.error('Create team error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/teams
// @desc    Get all teams
// @access  Public
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('captain', 'username avatar')
            .populate('members', 'username avatar status')
        res.json(teams)
    } catch (error) {
        console.error('Get teams error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   POST /api/teams/:id/join
// @desc    Join a team (simplified for now, usually would be an invite system)
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
        if (!team) {
            return res.status(404).json({ message: 'Team not found' })
        }

        if (team.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already a member' })
        }

        team.members.push(req.user._id)
        await team.save()

        res.json({ message: 'Joined team successfully', team })
    } catch (error) {
        console.error('Join team error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
