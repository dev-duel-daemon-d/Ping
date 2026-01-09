import mongoose from 'mongoose'

const enchantmentSchema = new mongoose.Schema(
    {
        enchanter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        enchanted: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Prevent duplicate enchantments (one user can only enchant another once)
enchantmentSchema.index({ enchanter: 1, enchanted: 1 }, { unique: true })

const Enchantment = mongoose.model('Enchantment', enchantmentSchema)

export default Enchantment
