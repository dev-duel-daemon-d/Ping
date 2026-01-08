import express from 'express'
import crypto from 'crypto'
import { body } from 'express-validator'
import User from '../models/User.js'
import { protect, generateToken } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'
import { sendEmail } from '../utils/sendEmail.js'
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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

// @route   POST /api/auth/google
// @desc    Login/Register with Google
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        
        // Verify Google Token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists - if they don't have googleId linked, link it now
            if (!user.googleId) {
                user.googleId = googleId;
                // If they previously had a different avatar (default), maybe update it? 
                // Let's keep existing avatar to not override user choice, unless it's empty
                if (!user.avatar) user.avatar = picture;
                
                // Ensure they are verified since Google verified the email
                user.isVerified = true;
                user.otp = undefined;
                user.otpExpires = undefined;
            }
        } else {
            // Create new user
            // Generate a random password-like string just to satisfy potential internal logic 
            // (though we made it optional in schema, having a strong random one is safe)
            // But better: we rely on schema optionality.
            
            // Generate a unique username based on Google name
            let username = name.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 1000);
            
            // Ensure username uniqueness (simple check)
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                username += Math.floor(Math.random() * 1000);
            }

            user = await User.create({
                username,
                email,
                avatar: picture,
                googleId,
                isVerified: true, // Google emails are verified
            });
        }

        // Update status
        user.status = 'online';
        user.lastSeen = new Date();
        await user.save();

        // Generate Token
        const jwtToken = generateToken(user._id);

        res.json({
            token: jwtToken,
            user: userResponse(user),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username can only contain letters, numbers, and underscores'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        validate,
    ],
    async (req, res) => {
        try {
            const { username, email, password } = req.body

            // Check if user already exists
            const userExists = await User.findOne({ $or: [{ email }, { username }] })
            if (userExists) {
                return res.status(400).json({
                    message: userExists.email === email
                        ? 'Email already registered'
                        : 'Username already taken'
                })
            }

            // Create user
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

            const user = await User.create({
                username,
                email,
                password,
                otp,
                otpExpires,
                isVerified: false
            })

            // Send OTP email
            let emailSent = false;
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Ping - Verify your email',
                    html: `
                        <h1>Welcome to Ping!</h1>
                        <p>Your verification code is:</p>
                        <h2 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h2>
                        <p>This code will expire in 10 minutes.</p>
                    `
                })
                emailSent = true;
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError)

                // In development, auto-verify to avoid blocking developers
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔓 Development Mode: Auto-verifying user due to email failure');
                    user.isVerified = true;
                    user.otp = undefined;
                    user.otpExpires = undefined;
                    await user.save();
                }
                // In production, user can still verify via resend OTP
            }

            res.status(201).json({
                message: emailSent
                    ? 'Registration successful. Please check your email for verification code.'
                    : (process.env.NODE_ENV === 'development'
                        ? 'Registration successful. Email service unavailable - account auto-verified for development.'
                        : 'Registration successful. Email service temporarily unavailable. Please use "Resend OTP" to verify.'),
                email: user.email,
                emailSent,
                autoVerified: !emailSent && process.env.NODE_ENV === 'development'
            })
        } catch (error) {
            console.error('Register error:', error)
            res.status(500).json({ message: 'Server error during registration' })
        }
    }
)

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validate,
    ],
    async (req, res) => {
        try {
            const { email, password } = req.body

            // Find user by email
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            // Check password
            const isMatch = await user.matchPassword(password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            // Handle unverified users
            if (!user.isVerified) {
                // Check if this is a legacy user (registered before email verification)
                // Legacy users won't have OTP fields set
                if (!user.otp && !user.otpExpires) {
                    // Auto-verify legacy user
                    console.log(`Auto-verifying legacy user: ${user.email}`)
                    user.isVerified = true
                    await user.save()
                } else {
                    // New user needs to verify email
                    return res.status(401).json({
                        message: 'Email not verified. Please check your email for the verification code.',
                        isVerified: false,
                        email: user.email,
                        needsVerification: true
                    })
                }
            }

            // Update status to online
            user.status = 'online'
            user.lastSeen = new Date()
            await user.save()

            // Generate token and respond
            const token = generateToken(user._id)

            res.json({
                token,
                user: userResponse(user),
            })
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({ message: 'Server error during login' })
        }
    }
)

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post(
    '/verify-email',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
        validate,
    ],
    async (req, res) => {
        try {
            const { email, otp } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Invalid email' })
            }

            if (user.isVerified) {
                return res.status(400).json({ message: 'Email already verified' })
            }

            if (user.otp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' })
            }

            if (user.otpExpires < Date.now()) {
                return res.status(400).json({ message: 'OTP expired' })
            }

            // Verify user
            user.isVerified = true
            user.otp = undefined
            user.otpExpires = undefined
            user.status = 'online'
            user.lastSeen = new Date()
            await user.save()

            // Generate token
            const token = generateToken(user._id)

            res.json({
                token,
                user: userResponse(user),
            })
        } catch (error) {
            console.error('Verification error:', error)
            res.status(500).json({ message: 'Server error during verification' })
        }
    }
)

// @route   POST /api/auth/resend-otp
// @desc    Resend verification OTP
// @access  Public
router.post(
    '/resend-otp',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        validate,
    ],
    async (req, res) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            if (user.isVerified) {
                return res.status(400).json({ message: 'Email already verified' })
            }

            // Generate new OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

            user.otp = otp
            user.otpExpires = otpExpires
            await user.save()

            // Send OTP email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Ping - Verify your email (Resend)',
                    html: `
                        <h1>Welcome back to Ping!</h1>
                        <p>Your new verification code is:</p>
                        <h2 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h2>
                        <p>This code will expire in 10 minutes.</p>
                    `
                })
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError)
                return res.status(500).json({ message: 'Failed to send email' })
            }

            res.json({ message: 'OTP sent successfully' })
        } catch (error) {
            console.error('Resend OTP error:', error)
            res.status(500).json({ message: 'Server error' })
        }
    }
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            user: userResponse(req.user),
        })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// @route   POST /api/auth/logout
// @desc    Logout user (update status)
// @access  Private
router.post('/logout', protect, async (req, res) => {
    try {
        req.user.status = 'offline'
        req.user.lastSeen = new Date()
        await req.user.save()

        res.json({ message: 'Logged out successfully' })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ message: 'Server error during logout' })
    }
})

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken()

        await user.save({ validateBeforeSave: false })

        // Create reset url
        // In production, this would be the frontend URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`

        // For development, we'll log it. In production, send via email
        console.log(`Password Reset URL: ${resetUrl}`)

        res.status(200).json({ success: true, data: 'Email sent' })
    } catch (error) {
        console.error('Forgot password error:', error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        res.status(500).json({ message: 'Email could not be sent' })
    }
})

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' })
        }

        // Set new password
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        // Generate new token
        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            token,
            user: userResponse(user),
        })
    } catch (error) {
        console.error('Reset password error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
