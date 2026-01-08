import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Palette,
  ChevronLeft,
  Shield,
  Smartphone,
  Mail,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, setMode, accentColor, changeAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState('account');

  // --- Mock State for UI Demo ---
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    marketing: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    onlineStatus: true
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 font-sans selection:bg-primary/30">
      
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold">Back to Dashboard</span>
          </button>
          <h1 className="font-bold text-xl text-white">Settings</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-4 sticky top-24">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 min-h-[500px]"
          >
            {/* --- Account Settings --- */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Account Settings</h2>
                  <p className="text-slate-400 text-sm">Manage your profile details and security.</p>
                </div>

                {/* Email Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Email Address</h3>
                  <div className="flex gap-4">
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="flex-1 bg-bg-dark/30 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                    />
                    {/* Placeholder for future implementation */}
                    <button className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                      Change
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4 border-t border-white/5 pt-8">
                  <h3 className="text-lg font-bold text-white">Password</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Change your password regularly to keep your account secure.
                  </p>
                  <button className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                    Update Password
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Delete Account</h3>
                      <p className="text-sm text-slate-400 mt-1 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Privacy Settings --- */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Privacy</h2>
                  <p className="text-slate-400 text-sm">Control who can see your profile and activity.</p>
                </div>

                {/* Profile Visibility */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Profile Visibility
                  </h3>
                  <div className="grid gap-3">
                    {['public', 'connections', 'private'].map((option) => (
                      <label 
                        key={option}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                          privacy.profileVisibility === option 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="visibility" 
                          value={option}
                          checked={privacy.profileVisibility === option}
                          onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                          privacy.profileVisibility === option ? 'border-primary' : 'border-slate-500'
                        }`}>
                          {privacy.profileVisibility === option && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white capitalize">{option === 'connections' ? 'Connections Only' : option}</span>
                          <p className="text-xs text-slate-400">
                            {option === 'public' && 'Anyone can see your profile details.'}
                            {option === 'connections' && 'Only people you are connected with can see details.'}
                            {option === 'private' && 'Your profile is hidden from search and public view.'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Online Status */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div>
                    <h3 className="font-bold text-white">Show Online Status</h3>
                    <p className="text-xs text-slate-400">Allow others to see when you are online.</p>
                  </div>
                  <div 
                    onClick={() => setPrivacy({...privacy, onlineStatus: !privacy.onlineStatus})}
                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${
                      privacy.onlineStatus ? 'bg-primary' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                      animate={{ x: privacy.onlineStatus ? 24 : 0 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- Notifications Settings --- */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Notifications</h2>
                  <p className="text-slate-400 text-sm">Manage how we communicate with you.</p>
                </div>

                <div className="space-y-4">
                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Push Notifications</h3>
                        <p className="text-xs text-slate-400">Receive alerts on your device.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setNotifications({...notifications, push: !notifications.push})}
                      className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                        notifications.push ? 'bg-primary' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div 
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: notifications.push ? 20 : 0 }}
                      />
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Email Digest</h3>
                        <p className="text-xs text-slate-400">Receive weekly summaries of activity.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                        notifications.email ? 'bg-primary' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div 
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: notifications.email ? 20 : 0 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Appearance Settings --- */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Appearance</h2>
                  <p className="text-slate-400 text-sm">Customize the look and feel of Ping.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-white mb-4">Color Mode</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'light', label: 'Light', icon: Sun },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setMode(item.id)}
                          className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-2xl transition-all ${
                            mode === item.id 
                              ? 'bg-primary/10 border-primary text-white' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                          style={{
                            borderColor: mode === item.id ? accentColor : '',
                            backgroundColor: mode === item.id ? `${accentColor}15` : ''
                          }}
                        >
                          <item.icon className="w-6 h-6" style={{ color: mode === item.id ? accentColor : '' }} />
                          <span className="font-bold text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-4">Accent Color</h3>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: 'Lime', hex: '#84cc16' },
                        { name: 'Sky', hex: '#0ea5e9' },
                        { name: 'Purple', hex: '#d946ef' },
                        { name: 'Orange', hex: '#f97316' },
                        { name: 'Red', hex: '#ef4444' },
                        { name: 'Cyan', hex: '#06b6d4' },
                        { name: 'Rose', hex: '#f43f5e' }
                      ].map((color) => (
                        <div key={color.hex} className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => changeAccentColor(color.hex)}
                            className="w-12 h-12 rounded-full border-4 transition-all hover:scale-110"
                            style={{ 
                              backgroundColor: color.hex,
                              borderColor: accentColor === color.hex ? 'white' : 'transparent',
                              boxShadow: accentColor === color.hex ? `0 0 15px ${color.hex}` : 'none'
                            }}
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;