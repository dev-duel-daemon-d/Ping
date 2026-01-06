import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/profile/data
// @desc    Get user's profile data (team history, tournaments, setup, socials)
// @access  Private
router.get('/data', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('teamHistory tournamentExperience gamingSetup socials')
        res.json(user)
    } catch (error) {
        console.error('Get profile data error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/profile/data/:username
// @desc    Get another user's profile data (public)
// @access  Public
router.get('/data/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('teamHistory tournamentExperience gamingSetup socials')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        console.error('Get profile data error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// ==================== SOCIALS ====================

// @route   PUT /api/profile/socials
// @desc    Update social media handles
// @access  Private
router.put('/socials', protect, async (req, res) => {
    try {
        const { twitter, instagram, twitch, youtube, tiktok, discord } = req.body
        const user = await User.findById(req.user._id)

        user.socials = {
            twitter: twitter !== undefined ? twitter : user.socials?.twitter || '',
            instagram: instagram !== undefined ? instagram : user.socials?.instagram || '',
            twitch: twitch !== undefined ? twitch : user.socials?.twitch || '',
            youtube: youtube !== undefined ? youtube : user.socials?.youtube || '',
            tiktok: tiktok !== undefined ? tiktok : user.socials?.tiktok || '',
            discord: discord !== undefined ? discord : user.socials?.discord || ''
        }

        await user.save()
        res.json(user.socials)
    } catch (error) {
        console.error('Update socials error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// ==================== TEAM HISTORY ====================

// @route   POST /api/profile/team-history
// @desc    Add new team to history
// @access  Private
router.post('/team-history', protect, async (req, res) => {
    try {
        const { name, logo, details, startDate, endDate } = req.body

        if (!name) {
            return res.status(400).json({ message: 'Team name is required' })
        }

        const user = await User.findById(req.user._id)
        user.teamHistory.push({ name, logo, details, startDate, endDate })
        await user.save()

        res.status(201).json(user.teamHistory)
    } catch (error) {
        console.error('Add team history error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/profile/team-history/:id
// @desc    Update a team in history
// @access  Private
router.put('/team-history/:id', protect, async (req, res) => {
    try {
        const { name, logo, details, startDate, endDate } = req.body
        const user = await User.findById(req.user._id)

        const teamIndex = user.teamHistory.findIndex(
            team => team._id.toString() === req.params.id
        )

        if (teamIndex === -1) {
            return res.status(404).json({ message: 'Team not found' })
        }

        user.teamHistory[teamIndex] = {
            ...user.teamHistory[teamIndex].toObject(),
            name: name || user.teamHistory[teamIndex].name,
            logo: logo !== undefined ? logo : user.teamHistory[teamIndex].logo,
            details: details !== undefined ? details : user.teamHistory[teamIndex].details,
            startDate: startDate || user.teamHistory[teamIndex].startDate,
            endDate: endDate || user.teamHistory[teamIndex].endDate
        }

        await user.save()
        res.json(user.teamHistory)
    } catch (error) {
        console.error('Update team history error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   DELETE /api/profile/team-history/:id
// @desc    Remove team from history
// @access  Private
router.delete('/team-history/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.teamHistory = user.teamHistory.filter(
            team => team._id.toString() !== req.params.id
        )
        await user.save()

        res.json(user.teamHistory)
    } catch (error) {
        console.error('Delete team history error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// ==================== TOURNAMENT EXPERIENCE ====================

// @route   POST /api/profile/tournaments
// @desc    Add new tournament experience
// @access  Private
router.post('/tournaments', protect, async (req, res) => {
    try {
        const { name, placement, date } = req.body

        if (!name) {
            return res.status(400).json({ message: 'Tournament name is required' })
        }

        const user = await User.findById(req.user._id)
        user.tournamentExperience.push({ name, placement, date })
        await user.save()

        res.status(201).json(user.tournamentExperience)
    } catch (error) {
        console.error('Add tournament error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/profile/tournaments/:id
// @desc    Update a tournament experience
// @access  Private
router.put('/tournaments/:id', protect, async (req, res) => {
    try {
        const { name, placement, date } = req.body
        const user = await User.findById(req.user._id)

        const tournamentIndex = user.tournamentExperience.findIndex(
            t => t._id.toString() === req.params.id
        )

        if (tournamentIndex === -1) {
            return res.status(404).json({ message: 'Tournament not found' })
        }

        user.tournamentExperience[tournamentIndex] = {
            ...user.tournamentExperience[tournamentIndex].toObject(),
            name: name || user.tournamentExperience[tournamentIndex].name,
            placement: placement !== undefined ? placement : user.tournamentExperience[tournamentIndex].placement,
            date: date || user.tournamentExperience[tournamentIndex].date
        }

        await user.save()
        res.json(user.tournamentExperience)
    } catch (error) {
        console.error('Update tournament error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   DELETE /api/profile/tournaments/:id
// @desc    Remove tournament from experience
// @access  Private
router.delete('/tournaments/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.tournamentExperience = user.tournamentExperience.filter(
            t => t._id.toString() !== req.params.id
        )
        await user.save()

        res.json(user.tournamentExperience)
    } catch (error) {
        console.error('Delete tournament error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// ==================== GAMING SETUP ====================

// @route   PUT /api/profile/setup
// @desc    Update gaming setup config
// @access  Private
router.put('/setup', protect, async (req, res) => {
    try {
        const { dpi, sensitivity, aspectRatio, resolution, mouse, crosshairCode } = req.body

        const user = await User.findById(req.user._id)

        user.gamingSetup = {
            dpi: dpi !== undefined ? dpi : user.gamingSetup?.dpi || 800,
            sensitivity: sensitivity !== undefined ? sensitivity : user.gamingSetup?.sensitivity || 0.35,
            aspectRatio: aspectRatio !== undefined ? aspectRatio : user.gamingSetup?.aspectRatio || '16:9',
            resolution: resolution !== undefined ? resolution : user.gamingSetup?.resolution || '1920x1080',
            mouse: mouse !== undefined ? mouse : user.gamingSetup?.mouse || '',
            crosshairCode: crosshairCode !== undefined ? crosshairCode : user.gamingSetup?.crosshairCode || ''
        }

        await user.save()
        res.json(user.gamingSetup)
    } catch (error) {
        console.error('Update gaming setup error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
