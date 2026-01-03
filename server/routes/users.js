import express from 'express'
import { body } from 'express-validator'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = express.Router()

const userResponse = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bannerImage: user.bannerImage,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    gamingAccounts: user.gamingAccounts,
    status: user.status,
    lastSeen: user.lastSeen,
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
        body('bio').optional().isLength({ max: 160 }).withMessage('Bio cannot exceed 160 characters'),
        body('location').optional().trim(),
        body('skills').optional().isArray().withMessage('Skills must be an array'),
        body('gamingAccounts').optional().isObject().withMessage('Gaming accounts must be an object'),
        validate,
    ],
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id)

            if (user) {
                user.bio = req.body.bio ?? user.bio
                user.location = req.body.location ?? user.location
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

export default router
