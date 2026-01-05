import express from 'express'
import User from '../models/User.js'
import Team from '../models/Team.js'
import Tournament from '../models/Tournament.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/search
// @desc    Unified search for users, teams, and tournaments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { q } = req.query
        
        let query = {}
        if (q) {
            const regex = new RegExp(q, 'i')
            query = regex
        }

        // Base user query to exclude self
        const userQuery = q 
            ? { username: query, _id: { $ne: req.user._id } } 
            : { _id: { $ne: req.user._id } }

        const [users, teams, tournaments] = await Promise.all([
            User.find(userQuery).select('username avatar bio status').limit(10).sort({ createdAt: -1 }),
            Team.find(q ? { name: query } : {}).select('name logo description').limit(10).sort({ createdAt: -1 }),
            Tournament.find(q ? { title: query } : {}).select('title game startDate bannerImage').limit(10).sort({ createdAt: -1 })
        ])

        res.json({
            users,
            teams,
            tournaments
        })
    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
