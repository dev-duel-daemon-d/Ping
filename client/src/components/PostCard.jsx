import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  MoreVertical,
  Trash2,
  Send,
  Loader2,
  Trophy,
  Gamepad2,
  X
} from 'lucide-react';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from './ImageModal';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const isLiked = user && likes.includes(user._id || user.id);
  const isAuthor = user && (post.author._id === user._id || post.author._id === user.id);

  const handleLike = async () => {
    const prevLikes = [...likes];
    const userId = user._id || user.id;

    if (isLiked) {
      setLikes(likes.filter(id => id !== userId));
    } else {
      setLikes([userId, ...likes]);
    }

    try {
      const res = await postService.like(post._id);
      setLikes(res.data);
    } catch (err) {
      setLikes(prevLikes);
      console.error("Failed to like post", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      const res = await postService.comment(post._id, newComment);
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await postService.deleteComment(post._id, commentId);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await postService.delete(post._id);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error("Failed to delete post", err);
    }
    setAnchorEl(null);
  };

  return (
    <div className="bg-[#1b1f23]/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden mb-6 flex flex-col relative group hover:border-lime-500/20 transition-all duration-300 shadow-xl shadow-black/20">

      {/* Type Indicator Strip */}
      {post.type === 'professional' && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-lime-500 to-transparent opacity-50" />
      )}

      {/* Post Header */}
      <div className="p-5 flex items-start justify-between shrink-0">
        <div className="flex gap-4">
          <Link to={`/dashboard/${post.author.username}`}>
            <div className="relative">
              <Avatar
                src={post.author.avatar}
                className="w-12 h-12 border-2 border-white/10 group-hover:border-lime-500/50 transition-colors shadow-lg"
              >
                {post.author.username?.[0]?.toUpperCase()}
              </Avatar>
              {post.type === 'professional' && (
                <div className="absolute -bottom-1 -right-1 bg-[#1b1f23] rounded-full p-0.5 border border-white/10">
                  <div className="bg-lime-500 rounded-full p-0.5">
                    <Trophy size={10} className="text-black" />
                  </div>
                </div>
              )}
            </div>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link to={`/dashboard/${post.author.username}`} className="font-bold text-slate-100 text-base hover:text-lime-400 transition-colors truncate block">
                {post.author.username}
              </Link>
              {post.game && (
                <span className="flex items-center gap-1 text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full border border-white/5 shrink-0">
                  <Gamepad2 size={10} />
                  {post.game}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {isAuthor && (
          <div className="relative z-10 shrink-0">
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: {
                  backgroundColor: "#1b1f23",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "12px",
                  marginTop: "8px"
                }
              }}
            >
              <MenuItem onClick={handleDeletePost} className="text-red-400 gap-2 hover:bg-white/5">
                <Trash2 size={16} /> Delete Post
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-5 pb-3 shrink-0">
        {post.content && (
          <p className="text-slate-200 leading-relaxed text-[15px]">
            {post.content}
          </p>
        )}
      </div>

      {/* Media - Only show if media exists */}
      {post.media && (
        <div
          className="bg-black/40 relative overflow-hidden flex items-center justify-center border-y border-white/5 cursor-pointer max-h-[400px]"
          onClick={() => setShowImageModal(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <img
            src={post.media}
            alt="Post content"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={post.media}
      />

      {/* Post Actions */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
            <span>{likes.length}</span>
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${showComments ? 'text-lime-500' : 'text-slate-400 hover:text-lime-400'}`}
          >
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
            <span>{comments.length}</span>
          </button>
        </div>

        <button className="text-slate-400 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Comments Section Overlay - to maintain card height */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-[#1b1f23] flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-lime-500" />
                Comments
              </h4>
              <button onClick={() => setShowComments(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <MessageSquare size={48} className="mx-auto mb-2" />
                    <p className="text-sm">No comments yet.</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 group/comment">
                      <Avatar
                        src={comment.user?.avatar}
                        className="w-8 h-8 border border-white/10 shrink-0"
                      >
                        {comment.user?.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 block hover:bg-white/10 transition-colors">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="font-bold text-slate-200 text-xs truncate">{comment.user?.username}</span>
                            <span className="text-[10px] text-slate-600 shrink-0">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed break-words">{comment.text}</p>
                        </div>

                        {user && (comment.user?._id === user._id || comment.user?._id === user.id) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-[10px] text-slate-500 hover:text-red-400 ml-2 mt-1 opacity-0 group-hover/comment:opacity-100 transition-opacity font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleComment} className="p-4 border-t border-white/5 bg-black/20 flex gap-3 items-center shrink-0">
              <Avatar
                src={user?.avatar}
                className="w-8 h-8 border border-lime-500/20"
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-[#1b1f23] border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || commenting}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-lime-500 rounded-lg text-black disabled:opacity-50 disabled:bg-transparent disabled:text-slate-600 hover:bg-lime-400 transition-all"
                >
                  {commenting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} strokeWidth={2.5} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
