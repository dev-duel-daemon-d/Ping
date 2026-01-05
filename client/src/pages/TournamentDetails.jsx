import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tournamentService } from '../services/api';
import Navbar from '../components/navigation/Navbar';
import { 
    Trophy, 
    Calendar, 
    Users, 
    Gamepad2, 
    Swords, 
    ArrowLeft, 
    Clock, 
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '@mui/material';

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Legendary': return 'bg-yellow-500 text-black';
        case 'Expert': return 'bg-purple-500 text-white';
        case 'Rookie': return 'bg-green-500 text-black';
        case 'Casual': return 'bg-blue-500 text-white';
        default: return 'bg-slate-500 text-white';
    }
};

const TournamentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchTournamentDetails();
    }, [id]);

    const fetchTournamentDetails = async () => {
        try {
            const res = await tournamentService.getById(id);
            setTournament(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch tournament details", error);
            setError("Failed to load tournament details.");
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        setJoining(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await tournamentService.join(id);
            setSuccessMsg('Successfully joined the tournament!');
            // Refresh details to update participant list
            await fetchTournamentDetails();
        } catch (err) {
            console.error("Failed to join tournament", err);
            setError(err.response?.data?.message || "Failed to join tournament.");
        } finally {
            setJoining(false);
        }
    };

    const isParticipant = tournament?.participants.some(p => p._id === user?._id || p._id === user?.id);
    const isFull = tournament?.participants.length >= tournament?.maxParticipants;

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen bg-black text-slate-200 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Tournament Not Found</h2>
                <button 
                    onClick={() => navigate('/contests')}
                    className="px-6 py-2 bg-lime-500 text-black rounded-full font-bold hover:bg-lime-400"
                >
                    Back to Contests
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-lime-500/30">
            <Navbar user={user} logout={logout} />

            <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/contests')}
                    className="flex items-center gap-2 text-slate-400 hover:text-lime-500 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Contests
                </button>

                {/* Banner Section */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 group">
                     {tournament.bannerImage ? (
                        <img 
                            src={tournament.bannerImage} 
                            alt={tournament.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                            <Trophy className="w-24 h-24 text-white/10" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <div className="flex gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(tournament.difficulty)}`}>
                                    {tournament.difficulty}
                                </span>
                                <span className="bg-lime-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                    {tournament.status}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tournament.title}</h1>
                            <p className="text-lime-400 font-bold text-xl">{tournament.game}</p>
                        </div>

                        {/* Action Card (Desktop) */}
                        <div className="hidden md:block bg-[#1b1f23]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 min-w-[300px]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400">Prize Pool</span>
                                <span className="text-2xl font-bold text-white">{tournament.prizePool}</span>
                            </div>
                            
                            {isParticipant ? (
                                <div className="w-full py-3 bg-green-500/20 text-green-500 border border-green-500/50 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Registered
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    disabled={joining || isFull}
                                    className="w-full py-3 bg-lime-500 hover:bg-lime-400 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {joining ? (
                                         <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                                        />
                                    ) : isFull ? (
                                        "Tournament Full"
                                    ) : (
                                        "Register Now"
                                    )}
                                </button>
                            )}
                            <p className="text-center text-xs text-slate-500 mt-2">
                                {tournament.participants.length} / {tournament.maxParticipants} spots filled
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Button */}
                <div className="md:hidden mb-8">
                     {isParticipant ? (
                        <div className="w-full py-4 bg-green-500/20 text-green-500 border border-green-500/50 rounded-xl font-bold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Registered
                        </div>
                    ) : (
                        <button
                            onClick={handleJoin}
                            disabled={joining || isFull}
                            className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-xl font-bold transition-all shadow-lg shadow-lime-500/20"
                        >
                            {joining ? "Processing..." : isFull ? "Tournament Full" : "Register Now"}
                        </button>
                    )}
                </div>

                {/* Alerts */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-500 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5" />
                        {successMsg}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-lime-500" />
                                About Tournament
                            </h2>
                            <div className="bg-[#1b1f23] p-6 rounded-2xl border border-white/5 text-slate-300 leading-relaxed">
                                {tournament.description}
                            </div>
                        </section>

                         {/* Format & Rules (Static for now) */}
                         <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Swords className="w-5 h-5 text-lime-500" />
                                Format & Rules
                            </h2>
                            <div className="bg-[#1b1f23] p-6 rounded-2xl border border-white/5 space-y-4 text-slate-300">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Single Elimination Bracket</li>
                                    <li>Best of 3 Matches (Finals Bo5)</li>
                                    <li>Standard Competitive Ruleset</li>
                                    <li>Anti-Cheat Required</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="bg-[#1b1f23] p-6 rounded-2xl border border-white/5 space-y-4">
                            <h3 className="font-bold text-white mb-4">Details</h3>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Calendar className="w-5 h-5" />
                                    <span>Start Date</span>
                                </div>
                                <span className="text-white font-medium">{new Date(tournament.startDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Clock className="w-5 h-5" />
                                    <span>Time</span>
                                </div>
                                <span className="text-white font-medium">{new Date(tournament.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Users className="w-5 h-5" />
                                    <span>Participants</span>
                                </div>
                                <span className="text-white font-medium">{tournament.participants.length} / {tournament.maxParticipants}</span>
                            </div>

                             <div className="pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-2 text-slate-400">
                                    <Users className="w-5 h-5" />
                                    <span>Organizer</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                                    <Avatar src={tournament.organizer?.avatar} className="w-8 h-8">
                                        {tournament.organizer?.username?.[0]}
                                    </Avatar>
                                    <span className="text-white font-medium">{tournament.organizer?.username}</span>
                                </div>
                            </div>
                        </div>

                        {/* Participants List */}
                         <div className="bg-[#1b1f23] p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-white mb-4">Participants</h3>
                            {tournament.participants.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {tournament.participants.map(p => (
                                        <div key={p._id} className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                                            <Avatar src={p.avatar} className="w-8 h-8 border border-white/10">
                                                {p.username?.[0]}
                                            </Avatar>
                                            <span className="text-slate-300 text-sm">{p.username}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No participants yet. Be the first!</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TournamentDetails;
