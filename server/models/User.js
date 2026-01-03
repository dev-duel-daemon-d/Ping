import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        avatar: {
            type: String,
            default: '',
        },
        bannerImage: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            maxlength: [160, 'Bio cannot exceed 160 characters'],
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        skills: {
            type: [String],
            default: [],
        },
        gamingAccounts: {
            steam: { type: String, default: '' },
            discord: { type: String, default: '' },
            riotId: { type: String, default: '' },
            psn: { type: String, default: '' },
            xbox: { type: String, default: '' },
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'away', 'busy'],
            default: 'offline',
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    return obj
}

const User = mongoose.model('User', userSchema)

export default User
