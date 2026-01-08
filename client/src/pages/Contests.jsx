import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tournamentService } from '../services/api';
import Navbar from '../components/navigation/Navbar';
import { Trophy, Calendar, Users, Gamepad2, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Legendary': return 'bg-yellow-500 text-black'; // Legendary -> Gold/Yellow
        case 'Expert': return 'bg-purple-500 text-white'; // Expert -> Purple
        case 'Rookie': return 'bg-green-500 text-black'; // Rookie -> Green
        case 'Casual': return 'bg-blue-500 text-white'; // Casual -> Blue
        default: return 'bg-slate-500 text-white';
    }
};

const Contests = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await tournamentService.getAll();
            setTournaments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch tournaments", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark text-slate-200 font-sans selection:bg-primary/30">
            <Navbar user={user} logout={logout} />
            
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
                <div className="flex items-center gap-3 mb-8">
                    <Trophy className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-white">Upcoming Tournaments</h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : tournaments.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No upcoming tournaments found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournaments.map((tournament) => (
                            <motion.div 
                                key={tournament._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group flex flex-col"
                            >
                                <div className="h-40 bg-gradient-to-br from-slate-800 to-black relative">
                                    {tournament.bannerImage && (
                                        <img src={tournament.bannerImage} alt={tournament.title} className="w-full h-full object-cover opacity-60" />
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(tournament.difficulty)}`}>
                                            {tournament.difficulty}
                                        </div>
                                        <div className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                                            {tournament.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{tournament.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{tournament.description}</p>
                                    
                                    <div className="space-y-2 text-sm text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <Gamepad2 className="w-4 h-4 text-primary" />
                                            <span>{tournament.game}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Swords className="w-4 h-4 text-primary" />
                                            <span>{tournament.difficulty} Level</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span>{tournament.participants.length} / {tournament.maxParticipants} Participants</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-primary font-bold">{tournament.prizePool}</span>
                                        <button 
                                            onClick={() => navigate(`/contests/${tournament._id}`)}
                                            className="px-4 py-2 bg-white/10 hover:bg-primary hover:text-black text-white rounded-lg transition-all text-sm font-bold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Contests;
