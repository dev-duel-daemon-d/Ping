import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        logo: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        theme: {
            type: String, // Hex color code
            default: '#84cc16' // Default lime green
        }
    },
    {
        timestamps: true
    }
)

const Game = mongoose.model('Game', gameSchema)

export default Game