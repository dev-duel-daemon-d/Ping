import mongoose from 'mongoose'

const tournamentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Tournament title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        game: {
            type: String,
            required: [true, 'Game name is required'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        prizePool: {
            type: String,
            default: 'TBD',
        },
        bannerImage: {
            type: String,
            default: '',
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Team',
            },
        ],
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            default: 'upcoming',
        },
        difficulty: {
            type: String,
            enum: ['Legendary', 'Expert', 'Rookie', 'Casual'],
            default: 'Casual',
        },
        maxParticipants: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    }
)

const Tournament = mongoose.model('Tournament', tournamentSchema)

export default Tournament
