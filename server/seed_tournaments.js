import mongoose from 'mongoose';
import Tournament from './models/Tournament.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ping';

const seedTournaments = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing tournaments to avoid duplicates and ensure new schema fields
        await Tournament.deleteMany({});
        console.log('Cleared existing tournaments');

        // Find a user to be the organizer
        let organizer = await User.findOne();
        if (!organizer) {
            console.log('No user found. Creating a dummy organizer...');
            organizer = await User.create({
                username: 'TournamentAdmin',
                email: 'admin@ping.com',
                password: 'password123'
            });
        }

        console.log(`Using organizer: ${organizer.username}`);

        const tournaments = [
            {
                title: 'Ping Championship 2026 - Elite',
                description: 'The highest level of competition. Only for the best.',
                game: 'Valorant',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
                prizePool: '$10,000',
                organizer: organizer._id,
                maxParticipants: 16,
                status: 'upcoming',
                difficulty: 'Legendary'
            },
            {
                title: 'Weekly Community Cup',
                description: 'Mid-tier competition for aspiring pros.',
                game: 'League of Legends',
                startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
                prizePool: '$500',
                organizer: organizer._id,
                maxParticipants: 32,
                status: 'upcoming',
                difficulty: 'Expert'
            },
            {
                title: 'Rookie Rumble',
                description: 'Perfect for beginners and new teams.',
                game: 'Counter-Strike 2',
                startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
                prizePool: '$100',
                organizer: organizer._id,
                maxParticipants: 64,
                status: 'upcoming',
                difficulty: 'Rookie'
            },
             {
                title: 'Friday Night Frag - Open',
                description: 'Open to everyone. Just for fun.',
                game: 'Overwatch 2',
                startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                prizePool: 'Skins',
                organizer: organizer._id,
                maxParticipants: 100,
                status: 'upcoming',
                difficulty: 'Casual'
            }
        ];

        await Tournament.insertMany(tournaments);
        console.log('Tournaments seeded successfully with difficulty levels');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding tournaments:', error);
        process.exit(1);
    }
};

seedTournaments();