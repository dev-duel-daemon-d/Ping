import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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
  Camera,
  Upload,
  History,
  Medal,
  Monitor,
  Download,
  Pencil,
  Mouse,
  Copy,
  Trash2,
  Plus,
} from "lucide-react";
import { Avatar, Modal, Box, IconButton, InputBase, Badge, Menu, MenuItem, Typography, Button, TextField } from "@mui/material";
import { X, Check } from "lucide-react";
import { userService, notificationService, connectionService, messageService, uploadService, profileService } from "../services/api";

// --- Helper Components ---
const NotificationMenu = ({ anchorEl, open, onClose, notifications, onAccept, onMarkRead, onOpenChat }) => {
  // Group message notifications by sender - only show unread
  const groupedNotifications = React.useMemo(() => {
    const messagesByUser = new Map();
    const otherNotifs = [];

    notifications.forEach(notif => {
      // Skip read notifications
      if (notif.isRead) return;

      if (notif.type === 'message') {
        const senderId = notif.sender?._id || notif.sender;
        if (messagesByUser.has(senderId)) {
          const existing = messagesByUser.get(senderId);
          existing.count += 1;
          existing.ids.push(notif._id);
        } else {
          messagesByUser.set(senderId, {
            ...notif,
            count: 1,
            ids: [notif._id],
            hasUnread: true,
            isGrouped: true,
          });
        }
      } else {
        otherNotifs.push(notif);
      }
    });

    return [...otherNotifs, ...Array.from(messagesByUser.values())];
  }, [notifications]);

  const handleGroupMarkRead = (ids) => {
    ids.forEach(id => onMarkRead(id));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: 350,
          backgroundColor: '#1b1f23',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
        },
      }}
    >
      <Typography variant="h6" className="p-4 border-b border-white/10 text-slate-200">
        Notifications
      </Typography>
      {groupedNotifications.length === 0 ? (
        <MenuItem className="justify-center text-slate-500 py-8">
          No new notifications
        </MenuItem>
      ) : (
        groupedNotifications.map((notif) => (
          <MenuItem
            key={notif._id}
            className={`flex flex-col items-start gap-2 border-b border-white/5 p-4 ${notif.hasUnread || !notif.isRead ? 'bg-white/5' : ''}`}
            onClick={() => {
              if (notif.type === 'message') {
                // Open chat with this sender
                if (onOpenChat) onOpenChat(notif.sender);
                onClose();
              }
              if (notif.isGrouped && notif.hasUnread) {
                handleGroupMarkRead(notif.ids);
              } else if (!notif.isRead) {
                onMarkRead(notif._id);
              }
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Avatar src={notif.sender?.avatar} className="w-10 h-10 border border-lime-500/30">
                  {notif.sender?.username?.[0]}
                </Avatar>
                {notif.isGrouped && notif.count > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-lime-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">{notif.count}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <Typography variant="subtitle2" className="text-slate-200 font-bold truncate">
                  {notif.sender?.username}
                </Typography>
                <Typography variant="body2" className="text-slate-400 text-xs">
                  {notif.type === 'connection_request' && 'sent you a connection request'}
                  {notif.type === 'connection_accepted' && 'accepted your connection request'}
                  {notif.type === 'message' && (
                    notif.count > 1
                      ? `sent you ${notif.count} messages`
                      : 'sent you a message'
                  )}
                </Typography>
              </div>
            </div>

            {notif.type === 'connection_request' && !notif.isRead && (
              <div className="flex gap-2 w-full mt-2 pl-12">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<Check size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept(notif.relatedId, notif._id);
                  }}
                  sx={{ bgcolor: '#84cc16', color: 'black', '&:hover': { bgcolor: '#65a30d' } }}
                >
                  Accept
                </Button>
              </div>
            )}
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

// --- Chat Modal with Jelly Animation ---
const ChatModal = ({ open, onClose, recipient, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);
  const { socket } = useSocket();

  const recipientId = recipient?._id || recipient?.id;

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history
  useEffect(() => {
    if (open && recipientId) {
      setLoading(true);
      messageService.getHistory(recipientId)
        .then(res => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch messages", err);
          setLoading(false);
        });
    }
  }, [open, recipientId]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (socket && open) {
      const handleReceive = (data) => {
        if (data.senderId === recipientId) {
          setMessages(prev => [...prev, {
            _id: data._id,
            sender: { _id: data.senderId, username: data.senderName },
            content: data.content,
            createdAt: data.createdAt,
          }]);
        }
      };

      const handleSent = (data) => {
        if (data.recipientId === recipientId) {
          setMessages(prev => [...prev, {
            _id: data._id,
            sender: { _id: currentUser?._id || currentUser?.id },
            content: data.content,
            createdAt: data.createdAt,
          }]);
        }
      };

      const handleTyping = (data) => {
        if (data.userId === recipientId) {
          setIsTyping(data.isTyping);
        }
      };

      socket.on('message:receive', handleReceive);
      socket.on('message:sent', handleSent);
      socket.on('typing:indicator', handleTyping);

      return () => {
        socket.off('message:receive', handleReceive);
        socket.off('message:sent', handleSent);
        socket.off('typing:indicator', handleTyping);
      };
    }
  }, [socket, open, recipientId, currentUser]);

  const handleSend = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit('message:private', {
      recipientId,
      content: newMessage.trim(),
    });

    setNewMessage("");
    socket.emit('typing:stop', { recipientId });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && recipientId) {
      socket.emit('typing:start', { recipientId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { recipientId });
      }, 1500);
    }
  };

  const isMine = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const myId = currentUser?._id || currentUser?.id;
    return senderId === myId || senderId?.toString() === myId?.toString();
  };

  // Jelly animation variants
  const jellyVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.8,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: 30,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Chat Modal with Jelly Effect */}
          <motion.div
            variants={jellyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg h-[600px] bg-gradient-to-b from-[#1a1e22] to-[#0d0f11] border border-white/10 rounded-3xl shadow-2xl shadow-lime-500/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/30">
              <div className="relative">
                <Avatar src={recipient?.avatar} className="w-12 h-12 border-2 border-lime-500/50">
                  {recipient?.username?.[0]?.toUpperCase()}
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${recipient?.status === 'online' ? 'bg-green-500' : 'bg-slate-600'} rounded-full border-2 border-[#1a1e22]`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{recipient?.username}</h3>
                <p className="text-xs text-slate-400">
                  {isTyping ? (
                    <span className="text-lime-400 flex items-center gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        typing...
                      </motion.span>
                    </span>
                  ) : (
                    recipient?.status === 'online' ? 'Online' : 'Offline'
                  )}
                </p>
              </div>
              <IconButton onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`flex ${isMine(msg) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine(msg)
                        ? 'bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-br-md'
                        : 'bg-white/10 text-white rounded-bl-md'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine(msg) ? 'text-black/60' : 'text-slate-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTypingChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-lime-500 to-green-500 flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 transition-shadow"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FindModal = ({ open, onClose, onConnect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      searchUsers("");
    }
  }, [open]);

  const searchUsers = async (q) => {
    setLoading(true);
    try {
      const response = await userService.search(q);
      setResults(response.data.users || []);
    } catch (error) {
      console.error("Search failed", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    searchUsers(q);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1b1f23] border border-white/10 rounded-2xl p-6 shadow-2xl outline-none">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Find Players</h2>
          <IconButton onClick={onClose} className="text-slate-400 hover:text-white">
            <X />
          </IconButton>
        </div>

        <div className="bg-white/5 rounded-full px-4 py-2 border border-white/10 mb-6 flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <InputBase
            placeholder="Search by username..."
            value={query}
            onChange={handleSearch}
            className="w-full text-slate-200"
            sx={{ color: 'inherit' }}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {results.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} className="border border-lime-500/30">
                  {user.username[0]}
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{user.username}</h4>
                  <p className="text-xs text-slate-500">{user.bio || "No bio available"}</p>
                </div>
              </div>
              <button
                onClick={() => onConnect(user._id)}
                className="px-3 py-1 bg-lime-500/10 text-lime-500 border border-lime-500/50 rounded-full text-xs font-bold hover:bg-lime-500 hover:text-black transition-all"
              >
                Connect
              </button>
            </div>
          ))}
          {results.length === 0 && !loading && (
            <div className="text-center text-slate-500 py-8">No players found</div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

const NavigationDialog = ({ open, onClose }) => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contests", path: "/contests" },
    { name: "Premium", path: "/premium" },
    { name: "Teams", path: "/teams" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Blur Background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Dialog Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 bg-[#1b1f23] border border-white/10 rounded-2xl p-8 shadow-2xl min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <IconButton onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileMenu = ({ anchorEl, open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Settings className="w-4 h-4" />, label: "Settings", action: () => { navigate('/settings'); onClose(); } },
    { icon: <Users className="w-4 h-4" />, label: "Edit Profile", action: () => { navigate('/edit-profile'); onClose(); } },
    { icon: <LogOut className="w-4 h-4" />, label: "Logout", action: onLogout, danger: true },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        style: {
          backgroundColor: '#1b1f23',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          borderRadius: '12px',
          minWidth: '180px',
          marginTop: '8px',
        },
      }}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          onClick={item.action}
          className={`flex items-center gap-3 px-4 py-3 ${item.danger ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-white/10 text-slate-300'}`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </MenuItem>
      ))}
    </Menu>
  );
};

const Navbar = ({ user, logout, onConnectionUpdate, onOpenChat }) => {
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const searchRef = React.useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Search users
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const res = await userService.search(searchQuery);
          setSearchResults(res.data.users || []);
          setShowSearchDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (username) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    navigate(`/dashboard/${username}`);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('notification:new', (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
      });
      return () => socket.off('notification:new');
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleAccept = async (requestId, notifId) => {
    try {
      await connectionService.acceptRequest(requestId);
      await notificationService.markRead(notifId);

      setNotifications(prev =>
        prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
      );

      if (onConnectionUpdate) onConnectionUpdate();

    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <IconButton
              onClick={() => setNavDialogOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className="w-5 h-0.5 bg-current rounded-full" />
              </div>
            </IconButton>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-lime-500 transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 bg-lime-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden md:block">
                Ping
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                  className="bg-transparent border-none focus:outline-none text-sm text-slate-200 placeholder:text-slate-500 w-64"
                />
              </div>
              {/* Search Results Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1f23] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleUserSelect(result.username)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <Avatar src={result.avatar} className="w-9 h-9 border border-lime-500/30">
                        {result.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 text-sm truncate">{result.username}</p>
                        <p className="text-xs text-slate-500 truncate">{result.bio || "No bio"}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${result.status === 'online' ? 'bg-green-500' : 'bg-slate-600'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              {/* Notification Button */}
              <IconButton
                onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Bell className="w-5 h-5" />
                </Badge>
              </IconButton>

              {/* Profile Avatar with Dropdown */}
              <IconButton
                onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                className="p-0"
              >
                <Avatar
                  src={user?.avatar}
                  className="w-8 h-8 border border-lime-500/50 cursor-pointer hover:border-lime-500 transition-colors"
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Menu */}
      <NotificationMenu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        notifications={notifications}
        onAccept={handleAccept}
        onMarkRead={handleMarkRead}
        onOpenChat={onOpenChat}
      />

      {/* Profile Menu */}
      <ProfileMenu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
        onLogout={handleLogout}
      />

      {/* Navigation Dialog */}
      <NavigationDialog
        open={navDialogOpen}
        onClose={() => setNavDialogOpen(false)}
      />
    </>
  );
};


const StatBar = ({ label, value, color = "bg-lime-500" }) => (
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
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-black flex items-center justify-center border border-white/10 group-hover:border-lime-500/50 transition-colors">
      <Icon className="w-6 h-6 text-lime-500" />
    </div>
    <div>
      <h4 className="font-bold text-slate-200">{game}</h4>
      <p className="text-xs text-slate-400">
        {role} • <span className="text-lime-500">{rank}</span>
      </p>
    </div>
  </div>
);

const PostCard = ({ post }) => (
  <div className="bg-[#1b1f23] rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
    {/* Post Header */}
    <div className="p-4 flex items-center gap-3 border-b border-white/5">
      <Avatar className="w-10 h-10 border border-lime-500/20">
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
        <button className="flex items-center gap-2 text-slate-400 hover:text-lime-500 transition-colors text-sm">
          <MessageSquare className="w-4 h-4" /> {post.comments}
        </button>
      </div>
      <button className="text-slate-400 hover:text-white transition-colors">
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- Team History Card with Glowing Aura ---
const TeamHistoryCard = ({ team }) => (
  <div className="relative min-w-[220px] max-w-[220px] group flex-shrink-0">
    {/* Glowing lime aura effect */}
    <div className="absolute inset-0 bg-lime-500/20 blur-xl rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
    <div className="absolute inset-0 bg-lime-400/10 blur-2xl rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110" />

    {/* Card content */}
    <div className="relative bg-[#1b1f23] border border-lime-500/30 group-hover:border-lime-500/60 rounded-2xl p-5 transition-all duration-300 h-full">
      <div className="flex items-center gap-3 mb-3">
        {/* Team Logo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-lime-500/40 flex items-center justify-center overflow-hidden">
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lime-500 font-bold text-lg">{team.name?.[0]}</span>
          )}
        </div>
        {/* Team Name */}
        <h4 className="font-bold text-white text-sm">{team.name}</h4>
      </div>

      {/* Details */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
        {team.details}
      </p>
    </div>
  </div>
);

// --- Team History Timeline ---
const TeamHistoryTimeline = ({ teams, isOwnProfile, onEdit, onAdd, onDelete }) => {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-[#1b1f23] border border-white/5 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-lime-500" />
          <h3 className="font-bold text-lg text-white">Team History Timeline</h3>
        </div>
        {isOwnProfile && (
          <button
            onClick={onAdd}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-slate-400 hover:text-lime-500" />
          </button>
        )}
      </div>

      <div className="relative group overflow-visible">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/90 backdrop-blur-md border border-lime-500/30 flex items-center justify-center text-white hover:bg-lime-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-black/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto overflow-y-visible pt-4 pb-4 scrollbar-hide scroll-smooth px-6 mx-4"
        >
          {teams.length > 0 ? (
            teams.map((team) => (
              <div key={team._id || team.id} className="relative min-w-[220px] max-w-[220px] group/card flex-shrink-0">
                {/* Animated Green Flame Effect */}
                <div className="flame-container">
                  <div className="flame-layer-1" />
                  <div className="flame-layer-2" />
                  <div className="flame-layer-3" />
                  {/* Ember particles */}
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                </div>

                {/* Animated glowing border */}
                <div className="flame-glow-border" />

                {/* Card content */}
                <div className="relative bg-[#1b1f23] border border-lime-500/30 group-hover/card:border-lime-500/60 rounded-2xl p-5 transition-all duration-300 h-full z-10">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Team Logo */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-lime-500/40 flex items-center justify-center overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lime-500 font-bold text-lg">{team.name?.[0]}</span>
                      )}
                    </div>
                    {/* Team Name */}
                    <h4 className="font-bold text-white text-sm flex-1">{team.name}</h4>

                    {/* Edit/Delete buttons */}
                    {isOwnProfile && (
                      <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(team)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-slate-400 hover:text-lime-500" />
                        </button>
                        <button
                          onClick={() => onDelete(team._id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {team.details}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-sm px-4 py-8">No team history yet.</div>
          )}

          {/* Add Team Card - only show for own profile */}
          {isOwnProfile && (
            <div
              onClick={onAdd}
              className="relative min-w-[220px] max-w-[220px] flex-shrink-0 border-2 border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-500 hover:border-lime-500/50 hover:text-lime-500 transition-all cursor-pointer group h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-lime-500/20 transition-colors">
                <span className="text-2xl">+</span>
              </div>
              <span className="text-xs font-medium">Add Team</span>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/90 backdrop-blur-md border border-lime-500/30 flex items-center justify-center text-white hover:bg-lime-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-black/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Experience and Tournaments ---
const ExperienceTournaments = ({ tournaments, isOwnProfile, onEdit, onAdd, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-[#1b1f23] border border-white/5 rounded-2xl p-6 mb-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Medal className="w-5 h-5 text-lime-500" />
        <h3 className="font-bold text-lg text-white">Experience and Tournaments</h3>
      </div>
      {isOwnProfile && (
        <button
          onClick={onAdd}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4 text-slate-400 hover:text-lime-500" />
        </button>
      )}
    </div>

    <div className="space-y-3">
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <div
            key={tournament._id || tournament.id}
            className="bg-white/5 border border-white/5 rounded-xl px-5 py-4 hover:bg-white/10 hover:border-lime-500/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-lime-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-medium text-slate-200">{tournament.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {tournament.placement && (
                  <span className="text-xs text-lime-500 font-bold bg-lime-500/10 px-3 py-1 rounded-full">
                    {tournament.placement}
                  </span>
                )}
                {isOwnProfile && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tournament)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3 text-slate-400 hover:text-lime-500" />
                    </button>
                    <button
                      onClick={() => onDelete(tournament._id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-500 text-sm px-4 py-4">No tournament experience yet.</div>
      )}

      {/* Add More Placeholder - only show for own profile */}
      {isOwnProfile && (
        <div
          onClick={onAdd}
          className="border-2 border-dashed border-white/10 rounded-xl px-5 py-4 flex items-center justify-center text-slate-500 hover:border-lime-500/50 hover:text-lime-500 transition-all cursor-pointer"
        >
          <span className="text-sm font-medium">+ Add Tournament</span>
        </div>
      )}
    </div>
  </motion.div>
);

// --- Setup & Config ---
const SetupConfig = ({ setup, isOwnProfile, onEdit, onCopy, copiedField }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="bg-[#1b1f23] border border-white/5 rounded-2xl p-6 mb-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Monitor className="w-5 h-5 text-lime-500" />
        <h3 className="font-bold text-lg text-white">Setup & Config</h3>
      </div>
      {isOwnProfile && (
        <button
          onClick={onEdit}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4 text-slate-400 hover:text-lime-500" />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group relative">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-lime-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1">
            <span className="font-medium text-slate-200 block">DPI + Game sens</span>
            <span className="text-xs text-slate-500">{setup?.dpi || 800} DPI • {setup?.sensitivity || 0.35} sens</span>
          </div>
          <button
            onClick={() => onCopy(`${setup?.dpi || 800} DPI, ${setup?.sensitivity || 0.35} sens`, 'dpi')}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedField === 'dpi' ? (
              <Check className="w-4 h-4 text-lime-500" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 hover:text-lime-500" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group relative">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-lime-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1">
            <span className="font-medium text-slate-200 block">Aspect ratio</span>
            <span className="text-xs text-slate-500">{setup?.aspectRatio || '16:9'} • {setup?.resolution || '1920x1080'}</span>
          </div>
          <button
            onClick={() => onCopy(`${setup?.aspectRatio || '16:9'}, ${setup?.resolution || '1920x1080'}`, 'aspect')}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedField === 'aspect' ? (
              <Check className="w-4 h-4 text-lime-500" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 hover:text-lime-500" />
            )}
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group mb-6">
      <div className="flex items-center gap-3">
        <Mouse className="w-5 h-5 text-lime-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-slate-200 block">Preferred Mouse and crosshair code</span>
          <span className="text-xs text-slate-500 truncate block">
            {setup?.mouse || 'Not set'} {setup?.crosshairCode ? `• ${setup.crosshairCode}` : ''}
          </span>
        </div>
        <button
          onClick={() => onCopy(setup?.crosshairCode || '', 'crosshair')}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          {copiedField === 'crosshair' ? (
            <Check className="w-4 h-4 text-lime-500" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 hover:text-lime-500" />
          )}
        </button>
      </div>
    </div>

    {/* Download as PDF */}
    <div className="flex justify-end">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-6 py-3 bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-xl font-bold hover:shadow-lg hover:shadow-lime-500/30 transition-all flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download as PDF
      </motion.button>
    </div>
  </motion.div>
);

// --- Edit Modal Base Component ---
const EditModal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Blur Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 bg-[#1b1f23] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <IconButton onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Team Edit Modal ---
const TeamEditModal = ({ open, onClose, onSave, editingTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    details: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name || '',
        logo: editingTeam.logo || '',
        details: editingTeam.details || '',
      });
    } else {
      setFormData({ name: '', logo: '', details: '' });
    }
  }, [editingTeam, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData, editingTeam?._id);
      onClose();
    } catch (err) {
      console.error('Failed to save team:', err);
    }
    setSaving(false);
  };

  return (
    <EditModal open={open} onClose={onClose} title={editingTeam ? "Edit Team" : "Add Team"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Team Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="Enter team name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Logo URL</label>
          <input
            type="text"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Details / Experience</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50 resize-none"
            placeholder="Describe your role and experience with this team..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-lime-500/30 transition-all"
          >
            {saving ? 'Saving...' : (editingTeam ? 'Update' : 'Add Team')}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Tournament Edit Modal ---
const TournamentEditModal = ({ open, onClose, onSave, editingTournament }) => {
  const [formData, setFormData] = useState({
    name: '',
    placement: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTournament) {
      setFormData({
        name: editingTournament.name || '',
        placement: editingTournament.placement || '',
      });
    } else {
      setFormData({ name: '', placement: '' });
    }
  }, [editingTournament, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData, editingTournament?._id);
      onClose();
    } catch (err) {
      console.error('Failed to save tournament:', err);
    }
    setSaving(false);
  };

  return (
    <EditModal open={open} onClose={onClose} title={editingTournament ? "Edit Tournament" : "Add Tournament"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Tournament Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="Enter tournament name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Placement / Result</label>
          <input
            type="text"
            value={formData.placement}
            onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="e.g., 1st Place, Top 8, etc."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-lime-500/30 transition-all"
          >
            {saving ? 'Saving...' : (editingTournament ? 'Update' : 'Add Tournament')}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Setup Edit Modal ---
const SetupEditModal = ({ open, onClose, onSave, currentSetup }) => {
  const [formData, setFormData] = useState({
    dpi: 800,
    sensitivity: 0.35,
    aspectRatio: '16:9',
    resolution: '1920x1080',
    mouse: '',
    crosshairCode: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentSetup) {
      setFormData({
        dpi: currentSetup.dpi || 800,
        sensitivity: currentSetup.sensitivity || 0.35,
        aspectRatio: currentSetup.aspectRatio || '16:9',
        resolution: currentSetup.resolution || '1920x1080',
        mouse: currentSetup.mouse || '',
        crosshairCode: currentSetup.crosshairCode || '',
      });
    }
  }, [currentSetup, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save setup:', err);
    }
    setSaving(false);
  };

  return (
    <EditModal open={open} onClose={onClose} title="Edit Gaming Setup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">DPI</label>
            <input
              type="number"
              value={formData.dpi}
              onChange={(e) => setFormData({ ...formData, dpi: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
              placeholder="800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Sensitivity</label>
            <input
              type="number"
              step="0.01"
              value={formData.sensitivity}
              onChange={(e) => setFormData({ ...formData, sensitivity: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
              placeholder="0.35"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Aspect Ratio</label>
            <input
              type="text"
              value={formData.aspectRatio}
              onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
              placeholder="16:9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Resolution</label>
            <input
              type="text"
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
              placeholder="1920x1080"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Mouse</label>
          <input
            type="text"
            value={formData.mouse}
            onChange={(e) => setFormData({ ...formData, mouse: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="e.g., Logitech G Pro X Superlight"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Crosshair Code</label>
          <input
            type="text"
            value={formData.crosshairCode}
            onChange={(e) => setFormData({ ...formData, crosshairCode: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-500/50"
            placeholder="0;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-lime-500/30 transition-all"
          >
            {saving ? 'Saving...' : 'Save Setup'}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { username: viewedUsername } = useParams();
  const { user, logout, loading } = useAuth();
  const [postTab, setPostTab] = useState('professional');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Profile data state
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [gamingSetup, setGamingSetup] = useState({
    dpi: 800,
    sensitivity: 0.35,
    aspectRatio: '16:9',
    resolution: '1920x1080',
    mouse: '',
    crosshairCode: ''
  });

  // Modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingTournament, setEditingTournament] = useState(null);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState(null);

  // Determine if viewing own profile or another user's
  const isOwnProfile = !viewedUsername || viewedUsername === user?.username;
  const displayUser = isOwnProfile ? user : viewedUser;

  // Check if the viewed user is already a connection
  const isConnected = React.useMemo(() => {
    if (isOwnProfile || !viewedUser) return false;
    const viewedId = viewedUser._id || viewedUser.id;
    return connections.some(conn =>
      (conn._id || conn.id) === viewedId || conn.username === viewedUser.username
    );
  }, [connections, viewedUser, isOwnProfile]);

  const fetchConnections = async () => {
    try {
      const response = await connectionService.getConnections();
      setConnections(response.data);
    } catch (error) {
      console.error("Failed to fetch connections", error);
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  // Fetch viewed user's profile when navigating to /dashboard/:username
  React.useEffect(() => {
    const fetchViewedUser = async () => {
      if (!isOwnProfile && viewedUsername) {
        setProfileLoading(true);
        try {
          const res = await userService.getProfile(viewedUsername);
          setViewedUser(res.data.user);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          setViewedUser(null);
        }
        setProfileLoading(false);
      } else {
        setViewedUser(null);
      }
    };
    fetchViewedUser();
  }, [viewedUsername, isOwnProfile]);

  const handleConnect = async (userId) => {
    try {
      await connectionService.sendRequest(userId);
      // Optional: Show success feedback or close modal
      setShowFindModal(false);
      // Refresh connections or show toast
    } catch (error) {
      console.error("Connection request failed", error);
    }
  };

  // Fetch profile data (teams, tournaments, setup)
  const fetchProfileData = async () => {
    try {
      const username = isOwnProfile ? null : viewedUsername;
      const res = username
        ? await profileService.getDataByUsername(username)
        : await profileService.getData();

      if (res.data) {
        setTeams(res.data.teamHistory || []);
        setTournaments(res.data.tournamentExperience || []);
        setGamingSetup(res.data.gamingSetup || {
          dpi: 800,
          sensitivity: 0.35,
          aspectRatio: '16:9',
          resolution: '1920x1080',
          mouse: '',
          crosshairCode: ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  React.useEffect(() => {
    if (user || viewedUsername) {
      fetchProfileData();
    }
  }, [user, viewedUsername, isOwnProfile]);

  // Team handlers
  const handleSaveTeam = async (formData, teamId) => {
    try {
      if (teamId) {
        const res = await profileService.updateTeam(teamId, formData);
        setTeams(res.data);
      } else {
        const res = await profileService.addTeam(formData);
        setTeams(res.data);
      }
    } catch (error) {
      console.error("Failed to save team", error);
      throw error;
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      const res = await profileService.deleteTeam(teamId);
      setTeams(res.data);
    } catch (error) {
      console.error("Failed to delete team", error);
    }
  };

  // Tournament handlers
  const handleSaveTournament = async (formData, tournamentId) => {
    try {
      if (tournamentId) {
        const res = await profileService.updateTournament(tournamentId, formData);
        setTournaments(res.data);
      } else {
        const res = await profileService.addTournament(formData);
        setTournaments(res.data);
      }
    } catch (error) {
      console.error("Failed to save tournament", error);
      throw error;
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    try {
      const res = await profileService.deleteTournament(tournamentId);
      setTournaments(res.data);
    } catch (error) {
      console.error("Failed to delete tournament", error);
    }
  };

  // Setup handler
  const handleSaveSetup = async (formData) => {
    try {
      const res = await profileService.updateSetup(formData);
      setGamingSetup(res.data);
    } catch (error) {
      console.error("Failed to save setup", error);
      throw error;
    }
  };

  // Copy to clipboard handler
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Open chat from notification
  const openChatWithUser = (sender) => {
    setChatRecipient(sender);
    setShowChatModal(true);
  };

  // Handle image upload (avatar or banner)
  const handleImageUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      if (type === 'avatar') setUploadingAvatar(true);
      if (type === 'banner') setUploadingBanner(true);

      const response = await uploadService.uploadImage(formData);
      const imageUrl = response.data.url;

      // Update user profile
      const updateData = type === 'avatar'
        ? { avatar: imageUrl }
        : { bannerImage: imageUrl };

      await userService.updateProfile(updateData);

      // Refetch user data
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      if (type === 'banner') setUploadingBanner(false);
    }
  };

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
        author: displayUser?.username || "User",
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
        author: displayUser?.username || "User",
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
        author: displayUser?.username || "User",
        time: "1d ago",
        title: "Insane Clutch!",
        content:
          "Check out this 1v5 clutch I pulled off yesterday. Still shaking!",
        likes: 1205,
        comments: 85,
      },
      {
        id: 4,
        author: displayUser?.username || "User",
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

  if (loading || profileLoading) return null;

  // If viewing another user but profile not found
  if (!isOwnProfile && !viewedUser && !profileLoading) {
    return (
      <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-lime-500 text-black rounded-full font-bold hover:bg-lime-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-lime-500/30 overflow-hidden relative">
      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[300px] h-[300px] bg-lime-400 rounded-full filter blur-[100px] opacity-20 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y - 150}px`,
        }}
      />
      <Navbar
        user={user}
        logout={() => { logout(); navigate('/'); }}
        onConnectionUpdate={fetchConnections}
        onOpenChat={openChatWithUser}
      />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        {/* --- Profile Section --- */}
        <div className="relative mb-8 group">
          {/* Banner */}
          <div className="h-64 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
            <img
              src={displayUser?.bannerImage || "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=80"}
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Upload banner button - only show for own profile */}
            {isOwnProfile && (
              <div className="absolute top-4 right-4 z-20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'banner')}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full cursor-pointer hover:bg-black/70 transition-colors border border-white/20"
                >
                  {uploadingBanner ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full"
                    />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                  <span className="text-white text-sm font-medium">Change Banner</span>
                </label>
              </div>
            )}
          </div>

          {/* Avatar & Info */}
          <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center z-20">
            <div className="relative">
              <div className="w-32 h-32 rounded-full p-1 bg-black relative group">
                <Avatar
                  src={displayUser?.avatar}
                  className="w-full h-full border-4 border-[#1b1f23]"
                  sx={{ width: "100%", height: "100%", fontSize: "3rem" }}
                >
                  {displayUser?.username?.charAt(0).toUpperCase()}
                </Avatar>
                {/* Upload avatar button - only show for own profile */}
                {isOwnProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'avatar')}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer flex flex-col items-center gap-1"
                    >
                      {uploadingAvatar ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-white" />
                          <span className="text-white text-xs">Change</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
              <div className={`absolute bottom-2 right-2 w-6 h-6 ${displayUser?.status === 'online' ? 'bg-green-500' : 'bg-slate-600'} border-4 border-black rounded-full`} />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                {displayUser?.username}
                <Zap className="w-5 h-5 text-lime-500 fill-lime-500" />
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                {displayUser?.bio || "Professional FPS Player | Content Creator"}
              </p>
              {/* Message, Connect, and Back buttons for viewing other profiles */}
              {!isOwnProfile && (
                <div className="mt-4 flex gap-3 justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChatModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-black rounded-full font-bold hover:shadow-lg hover:shadow-lime-500/30 transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </motion.button>
                  {!isConnected && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleConnect(viewedUser?._id || viewedUser?.id)}
                      className="px-6 py-2 bg-white/10 text-lime-400 rounded-full font-bold hover:bg-lime-500/20 transition-all flex items-center gap-2 border border-lime-500/50"
                    >
                      <Users className="w-4 h-4" /> +Connect
                    </motion.button>
                  )}
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Back
                  </button>
                </div>
              )}
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
              <Gamepad2 className="w-5 h-5 text-lime-500" />
              <h3 className="font-bold text-lg text-white">
                Focus Game & Experience
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {games.map((game, i) => (
                <GameCard key={i} {...game} />
              ))}
              <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-lime-500/50 hover:text-lime-500 transition-all cursor-pointer group h-full min-h-[80px]">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-lime-500/20 transition-colors">
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
              <Brain className="w-5 h-5 text-lime-500" />
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
              <Users className="w-5 h-5 text-lime-500" />
              <h3 className="font-bold text-lg text-white">Connections</h3>
            </div>
            <Link to="/connections" className="text-xs text-lime-500 hover:underline">
              View All
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {connections.length > 0 ? (
              connections.map((conn) => (
                <div
                  key={conn._id}
                  onClick={() => navigate(`/dashboard/${conn.username}`)}
                  className="flex flex-col items-center min-w-[80px] group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-lime-500 transition-colors mb-2 overflow-hidden">
                    <Avatar
                      src={conn.avatar}
                      className="w-full h-full"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      {conn.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                  <span className="text-xs text-slate-400 font-medium truncate w-full text-center group-hover:text-white transition-colors">
                    {conn.username}
                  </span>
                  <span className="text-[10px] text-slate-600 truncate w-full text-center">
                    {conn.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm px-4">No connections yet. Go find some players!</div>
            )}
            <div
              onClick={() => setShowFindModal(true)}
              className="flex flex-col items-center justify-center min-w-[80px] cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors mb-2">
                <span className="text-slate-500 group-hover:text-white transition-colors">
                  +
                </span>
              </div>
              <span className="text-xs text-slate-500">Find</span>
            </div>
          </div>
        </motion.div>

        <FindModal
          open={showFindModal}
          onClose={() => setShowFindModal(false)}
          onConnect={handleConnect}
        />

        {/* Chat Modal */}
        <ChatModal
          open={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setChatRecipient(null);
          }}
          recipient={chatRecipient || viewedUser}
          currentUser={user}
        />

        {/* --- Team History Timeline --- */}
        <TeamHistoryTimeline
          teams={teams}
          isOwnProfile={isOwnProfile}
          onEdit={(team) => { setEditingTeam(team); setShowTeamModal(true); }}
          onAdd={() => { setEditingTeam(null); setShowTeamModal(true); }}
          onDelete={handleDeleteTeam}
        />

        {/* --- Experience and Tournaments --- */}
        <ExperienceTournaments
          tournaments={tournaments}
          isOwnProfile={isOwnProfile}
          onEdit={(tournament) => { setEditingTournament(tournament); setShowTournamentModal(true); }}
          onAdd={() => { setEditingTournament(null); setShowTournamentModal(true); }}
          onDelete={handleDeleteTournament}
        />

        {/* --- Setup & Config --- */}
        <SetupConfig
          setup={gamingSetup}
          isOwnProfile={isOwnProfile}
          onEdit={() => setShowSetupModal(true)}
          onCopy={handleCopy}
          copiedField={copiedField}
        />

        {/* Edit Modals */}
        <TeamEditModal
          open={showTeamModal}
          onClose={() => { setShowTeamModal(false); setEditingTeam(null); }}
          onSave={handleSaveTeam}
          editingTeam={editingTeam}
        />
        <TournamentEditModal
          open={showTournamentModal}
          onClose={() => { setShowTournamentModal(false); setEditingTournament(null); }}
          onSave={handleSaveTournament}
          editingTournament={editingTournament}
        />
        <SetupEditModal
          open={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onSave={handleSaveSetup}
          currentSetup={gamingSetup}
        />

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
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${postTab === tab
                    ? "bg-lime-500 text-black shadow-lg shadow-lime-500/20"
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
              className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-lime-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPost}
              className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-lime-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {currentPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPostIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentPostIndex
                    ? "bg-lime-500 w-6"
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
