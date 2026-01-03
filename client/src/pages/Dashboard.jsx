import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  Heart,
  Target,
  Swords,
  Brain,
  Crosshair,
  Search,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar } from "@mui/material";

// --- Helper Components ---

const Navbar = ({ user, logout }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16">
    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative">
          <Gamepad2 className="w-8 h-8 text-yellow-500 transition-transform group-hover:rotate-12" />
          <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden md:block">
          Ping
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search players, teams..."
            className="bg-transparent border-none focus:outline-none text-sm text-slate-200 placeholder:text-slate-500 w-64"
          />
        </div>

        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <Avatar
            src={user?.avatar}
            className="w-8 h-8 border border-yellow-500/50"
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const StatBar = ({ label, value, color = "bg-yellow-500" }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-bold">{value}%</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const GameCard = ({ game, role, rank, icon: Icon }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-black flex items-center justify-center border border-white/10 group-hover:border-yellow-500/50 transition-colors">
      <Icon className="w-6 h-6 text-yellow-500" />
    </div>
    <div>
      <h4 className="font-bold text-slate-200">{game}</h4>
      <p className="text-xs text-slate-400">
        {role} • <span className="text-yellow-500">{rank}</span>
      </p>
    </div>
  </div>
);

const PostCard = ({ post }) => (
  <div className="bg-[#1b1f23] rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
    {/* Post Header */}
    <div className="p-4 flex items-center gap-3 border-b border-white/5">
      <Avatar className="w-10 h-10 border border-yellow-500/20">
        {post.author[0]}
      </Avatar>
      <div>
        <h4 className="font-bold text-slate-200 text-sm">{post.author}</h4>
        <p className="text-xs text-slate-500">{post.time}</p>
      </div>
    </div>

    {/* Post Content */}
    <div className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-black/50 to-transparent relative group">
      {post.image && (
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
          <img
            src={post.image}
            alt="Post bg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1f23] via-transparent to-transparent" />
        </div>
      )}
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          {post.title}
        </h3>
        <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">
          {post.content}
        </p>
      </div>
    </div>

    {/* Post Footer */}
    <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm group">
          <Heart className="w-4 h-4 group-hover:fill-red-500" /> {post.likes}
        </button>
        <button className="flex items-center gap-2 text-slate-400 hover:text-yellow-500 transition-colors text-sm">
          <MessageSquare className="w-4 h-4" /> {post.comments}
        </button>
      </div>
      <button className="text-slate-400 hover:text-white transition-colors">
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [postTab, setPostTab] = useState('professional');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- Mock Data ---
  const games = [
    { game: "Valorant", role: "Duelist", rank: "Radiant", icon: Crosshair },
    {
      game: "League of Legends",
      role: "Mid Laner",
      rank: "Challenger",
      icon: Swords,
    },
    {
      game: "Counter-Strike 2",
      role: "AWPer",
      rank: "Global Elite",
      icon: Target,
    },
  ];

  const posts = {
    professional: [
      {
        id: 1,
        author: user?.username || "User",
        time: "2h ago",
        title: "Looking for Team",
        content:
          "Currently looking for a T1/T2 team for the upcoming season. Main Duelist/Flex. Previous exp in VCT.",
        likes: 245,
        comments: 42,
        image:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      },
      {
        id: 2,
        author: user?.username || "User",
        time: "5h ago",
        title: "Tournament Win",
        content:
          "Just secured 1st place in the Weekly Community Cup! GG to all teams.",
        likes: 892,
        comments: 120,
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      },
    ],
    casual: [
      {
        id: 3,
        author: user?.username || "User",
        time: "1d ago",
        title: "Insane Clutch!",
        content:
          "Check out this 1v5 clutch I pulled off yesterday. Still shaking!",
        likes: 1205,
        comments: 85,
      },
      {
        id: 4,
        author: user?.username || "User",
        time: "2d ago",
        title: "New Setup Setup",
        content: "Finally upgraded my rig. Specs in comments.",
        likes: 450,
        comments: 67,
      },
    ],
  };

  const currentPosts = posts[postTab];

  const nextPost = () => {
    setCurrentPostIndex((prev) => (prev + 1) % currentPosts.length);
  };

  const prevPost = () => {
    setCurrentPostIndex(
      (prev) => (prev - 1 + currentPosts.length) % currentPosts.length,
    );
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-yellow-500/30 overflow-hidden relative">
      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[300px] h-[300px] bg-yellow-400 rounded-full filter blur-[100px] opacity-20 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y - 150}px`,
        }}
      />
      <Navbar user={user} logout={() => { logout(); navigate('/'); }} />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        {/* --- Profile Section --- */}
        <div className="relative mb-8 group">
          {/* Banner */}
          <div className="h-64 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
            <img
              src="https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=80"
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Avatar & Info */}
          <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center z-20">
            <div className="relative">
              <div className="w-32 h-32 rounded-full p-1 bg-black">
                <Avatar
                  src={user?.avatar}
                  className="w-full h-full border-4 border-[#1b1f23]"
                  sx={{ width: "100%", height: "100%", fontSize: "3rem" }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                {user?.username}
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                Professional FPS Player | Content Creator
              </p>
            </div>
          </div>
        </div>
        <div className="h-20" /> {/* Spacer for profile overlap */}
        {/* --- Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Focus Game & Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-[#1b1f23] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Gamepad2 className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-lg text-white">
                Focus Game & Experience
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {games.map((game, i) => (
                <GameCard key={i} {...game} />
              ))}
              <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-yellow-500/50 hover:text-yellow-500 transition-all cursor-pointer group h-full min-h-[80px]">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-yellow-500/20 transition-colors">
                  <span className="text-lg">+</span>
                </div>
                <span className="text-xs font-medium">Add Game</span>
              </div>
            </div>
          </motion.div>

          {/* Stat Graphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1b1f23] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-lg text-white">Stats Graph</h3>
            </div>

            <div className="space-y-4">
              <StatBar label="Aim / Accuracy" value={92} color="bg-red-500" />
              <StatBar label="Game Sense" value={85} color="bg-blue-500" />
              <StatBar label="Teamwork" value={88} color="bg-green-500" />
              <StatBar label="Utility Usage" value={76} color="bg-purple-500" />
            </div>
          </motion.div>
        </div>
        {/* --- Connections --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1b1f23] border border-white/5 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-lg text-white">Connections</h3>
            </div>
            <button className="text-xs text-yellow-500 hover:underline">
              View All
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[80px] group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-yellow-500 transition-colors mb-2 overflow-hidden">
                  <img
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium truncate w-full text-center group-hover:text-white transition-colors">
                  Player {i}
                </span>
                <span className="text-[10px] text-slate-600 truncate w-full text-center">
                  Pro Team
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center min-w-[80px] cursor-pointer group">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors mb-2">
                <span className="text-slate-500 group-hover:text-white transition-colors">
                  +
                </span>
              </div>
              <span className="text-xs text-slate-500">Find</span>
            </div>
          </div>
        </motion.div>
        {/* --- Posts Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#1b1f23] border border-white/10 rounded-full p-1 flex gap-1">
              {["professional", "casual"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setPostTab(tab);
                    setCurrentPostIndex(0);
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    postTab === tab
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative group">
            <div className="overflow-hidden rounded-2xl min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${postTab}-${currentPostIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <PostCard post={currentPosts[currentPostIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevPost}
              className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPost}
              className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {currentPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPostIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPostIndex
                      ? "bg-yellow-500 w-6"
                      : "bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
