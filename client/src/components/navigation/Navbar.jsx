import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { IconButton, Badge, Avatar } from '@mui/material';
import { Gamepad2, Search, Bell } from 'lucide-react';
import { notificationService, connectionService, userService } from '../../services/api';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import NavigationDialog from './NavigationDialog';

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10 h-16">
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
                <Gamepad2 className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleUserSelect(result.username)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <Avatar src={result.avatar} className="w-9 h-9 border border-primary/30">
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
                  className="w-8 h-8 border border-primary/50 cursor-pointer hover:border-primary transition-colors"
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

export default Navbar;
