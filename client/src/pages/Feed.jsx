import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Navbar from '../components/navigation/Navbar';

const Feed = () => {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 'all', 'professional', 'casual'

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
        <>
            <Navbar user={user} logout={logout} />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#0f172a',
                    pt: { xs: 10, md: 12 },
                    pb: 4,
                }}
            >
                <Container maxWidth="md">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 1,
                                background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Feed
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}
                        >
                            Discover what's happening in the gaming community
                        </Typography>
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
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                mb: 3,
                                mt: 4,
                            }}
                        >
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
                                            color: '#84cc16',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#84cc16',
                                        height: 3,
                                    },
                                }}
                            >
                                <Tab label="All Posts" value="all" />
                                <Tab label="Professional" value="professional" />
                                <Tab label="Casual" value="casual" />
                            </Tabs>
                        </Box>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 8,
                            }}
                        >
                            <CircularProgress sx={{ color: '#84cc16' }} />
                        </Box>
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
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            px: 3,
                                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: 3,
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 600,
                                                mb: 2,
                                            }}
                                        >
                                            No posts yet
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                        >
                                            Be the first to share something with the community!
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                </Box>
                            )}
                        </AnimatePresence>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Feed;
