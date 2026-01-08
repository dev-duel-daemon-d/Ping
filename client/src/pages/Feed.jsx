import { useState, useEffect } from 'react';
import { CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Navbar from '../components/navigation/Navbar';

const Feed = () => {
    const { user, logout } = useAuth();
    const { accentColor } = useTheme();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 'all', 'professional', 'casual'
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Mouse tracking for glow effect
    useEffect(() => {
        const handleMouse = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [filterType]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const type = filterType === 'all' ? undefined : filterType;
            const response = await postService.getAll(type);
            setPosts(response.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    const handleFilterChange = (event, newValue) => {
        setFilterType(newValue);
    };

    return (
        <div className="min-h-screen bg-bg-dark text-slate-200 font-sans selection:bg-primary/30 overflow-hidden relative">
            {/* Mouse Glow Effect */}
            <div
                className="fixed w-[300px] h-[300px] rounded-full filter blur-[100px] opacity-20 pointer-events-none z-0 transition-opacity duration-300"
                style={{
                    left: `${mousePos.x - 150}px`,
                    top: `${mousePos.y - 150}px`,
                    backgroundColor: accentColor,
                }}
            />

            <Navbar user={user} logout={logout} />

            <main className="max-w-3xl mx-auto px-4 pt-24 pb-20 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{
                            background: `linear-gradient(135deg, ${accentColor} 0%, var(--color-secondary) 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Feed
                    </h1>
                    <p className="text-slate-400 mb-6">
                        Discover what's happening in the gaming community
                    </p>
                </motion.div>

                {/* Create Post */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <CreatePost onPostCreated={handlePostCreated} />
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="border-b border-white/10 mb-6 mt-8">
                        <Tabs
                            value={filterType}
                            onChange={handleFilterChange}
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&.Mui-selected': {
                                        color: accentColor,
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: accentColor,
                                    height: 3,
                                },
                            }}
                        >
                            <Tab label="All Posts" value="all" />
                            <Tab label="Professional" value="professional" />
                            <Tab label="Casual" value="casual" />
                        </Tabs>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <CircularProgress sx={{ color: accentColor }} />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>
                    </motion.div>
                )}

                {/* Posts List */}
                {!loading && !error && (
                    <AnimatePresence mode="popLayout">
                        {posts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center py-16 px-6 bg-white/5 rounded-2xl border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        No posts yet
                                    </h3>
                                    <p className="text-slate-400">
                                        Be the first to share something with the community!
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {posts.map((post, index) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                        layout
                                    >
                                        <PostCard
                                            post={post}
                                            onDelete={handlePostDeleted}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
};

export default Feed;
