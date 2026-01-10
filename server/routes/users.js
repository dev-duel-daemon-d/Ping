import express from 'express'
import { body } from 'express-validator'
import User from '../models/User.js'
import Connection from '../models/Connection.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'
import { getConnectedUsers } from '../socket/index.js'

const router = express.Router()

const userResponse = (user) => ({
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    bannerImage: user.bannerImage,
    tagline: user.tagline,
    bio: user.bio,
    location: user.location,
    phoneNumber: user.phoneNumber,
    languages: user.languages,
    skills: user.skills,
    gamingAccounts: user.gamingAccounts,
    status: user.status,
    lastSeen: user.lastSeen,
    hasPassword: !!user.password,
    preferences: user.preferences,
    enchantmentCount: user.enchantmentCount,
})

// @route   GET /api/users/explore
// @desc    Get all users with connection status
// @access  Private
router.get('/explore', protect, async (req, res) => {
    try {
        const currentUserId = req.user._id

        // 1. Get all users except current user
        const allUsers = await User.find({ _id: { $ne: currentUserId } })
            .select('username avatar bio status')
            .lean()

        // 2. Get all connections involving current user
        const connections = await Connection.find({
            $or: [{ requester: currentUserId }, { recipient: currentUserId }]
        }).lean()

        // 3. Create a map for quick lookup
        const connectionMap = new Map()
        connections.forEach(conn => {
            const otherId = conn.requester.toString() === currentUserId.toString()
                ? conn.recipient.toString()
                : conn.requester.toString()

            let status = 'none'
            if (conn.status === 'accepted') {
                status = 'connected'
            } else if (conn.status === 'pending') {
                status = conn.requester.toString() === currentUserId.toString()
                    ? 'pending_sent'
                    : 'pending_received'
            }
            connectionMap.set(otherId, status)
        })

        // 4. Attach status to users
        const usersWithStatus = allUsers.map(user => ({
            ...user,
            connectionStatus: connectionMap.get(user._id.toString()) || 'none'
        }))

        // 5. Sort: Connected first, then pending, then none
        usersWithStatus.sort((a, b) => {
            const score = (status) => {
                if (status === 'connected') return 3
                if (status === 'pending_received') return 2
                if (status === 'pending_sent') return 1
                return 0
            }
            return score(b.connectionStatus) - score(a.connectionStatus)
        })

        res.json(usersWithStatus)
    } catch (error) {
        console.error('Explore users error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   GET /api/users/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({ user: userResponse(user) })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
    '/profile',
    [
        protect,
        body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
        body('fullName').optional().trim().isLength({ max: 50 }).withMessage('Full name cannot exceed 50 characters'),
        body('tagline').optional().isLength({ max: 100 }).withMessage('Tagline cannot exceed 100 characters'),
        body('bio').optional().isLength({ max: 160 }).withMessage('Bio cannot exceed 160 characters'),
        body('location').optional().trim(),
        body('phoneNumber').optional().trim(),
        body('languages').optional().isArray().withMessage('Languages must be an array'),
        body('skills').optional().isArray().withMessage('Skills must be an array'),
        body('gamingAccounts').optional().isObject().withMessage('Gaming accounts must be an object'),
        validate,
    ],
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id)

            if (user) {
                // Check if username is being updated and if it's available
                if (req.body.username && req.body.username !== user.username) {
                    const userExists = await User.findOne({ username: req.body.username })
                    if (userExists) {
                        return res.status(400).json({ message: 'Username already taken' })
                    }
                    user.username = req.body.username
                }

                user.fullName = req.body.fullName ?? user.fullName
                user.tagline = req.body.tagline ?? user.tagline
                user.bio = req.body.bio ?? user.bio
                user.location = req.body.location ?? user.location
                user.phoneNumber = req.body.phoneNumber ?? user.phoneNumber
                user.languages = req.body.languages ?? user.languages
                user.skills = req.body.skills ?? user.skills
                user.avatar = req.body.avatar ?? user.avatar
                user.bannerImage = req.body.bannerImage ?? user.bannerImage

                if (req.body.gamingAccounts) {
                    user.gamingAccounts = {
                        ...user.gamingAccounts,
                        ...req.body.gamingAccounts
                    }
                }

                const updatedUser = await user.save()
                res.json({ user: userResponse(updatedUser) })
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        } catch (error) {
            console.error('Update profile error:', error)
            res.status(500).json({ message: 'Server error' })
        }
    }
)

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put(
    '/change-password',
    [
        protect,
        body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        validate,
    ],
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id)

            if (user) {
                // If user has a password, verify current password
                if (user.password) {
                    if (!req.body.currentPassword) {
                        return res.status(400).json({ message: 'Current password is required' })
                    }
                    const isMatch = await user.matchPassword(req.body.currentPassword)
                    if (!isMatch) {
                        return res.status(400).json({ message: 'Invalid current password' })
                    }
                }

                user.password = req.body.newPassword
                const updatedUser = await user.save()

                res.json({ message: 'Password updated successfully', user: userResponse(updatedUser) })
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        } catch (error) {
            console.error('Change password error:', error)
            res.status(500).json({ message: 'Server error' })
        }
    }
)

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put(
    '/preferences',
    [
        protect,
        body('showOnlineStatus').isBoolean().withMessage('showOnlineStatus must be a boolean'),
        validate,
    ],
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const { showOnlineStatus } = req.body
            const io = req.app.get('io')

            // If checking user.preferences directly, ensure it exists (schema default handles this for new users, but older docs might not have it)
            if (!user.preferences) user.preferences = { showOnlineStatus: true }

            user.preferences.showOnlineStatus = showOnlineStatus

            // Handle Status Update based on preference change
            const connectedUsers = getConnectedUsers()
            const isConnected = connectedUsers.has(user._id.toString())

            if (showOnlineStatus) {
                // User wants to be seen. If they are actually connected, set to online.
                if (isConnected) {
                    user.status = 'online'
                    // Broadcast online
                    io.emit('user:online', {
                        userId: user._id,
                        username: user.username,
                    })
                }
            } else {
                // User wants to hide. Set to offline.
                user.status = 'offline'
                // Broadcast offline
                io.emit('user:offline', {
                    userId: user._id,
                    username: user.username,
                })
            }

            const updatedUser = await user.save()
            res.json({ user: userResponse(updatedUser) })

        } catch (error) {
            console.error('Update preferences error:', error)
            res.status(500).json({ message: 'Server error' })
        }
    }
)

// @route   DELETE /api/users/profile
// @desc    Delete user profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (user) {
            await User.deleteOne({ _id: user._id })
            res.json({ message: 'User removed' })
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
