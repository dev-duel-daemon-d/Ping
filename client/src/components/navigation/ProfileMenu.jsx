import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { Settings, Users, LogOut } from 'lucide-react';

const ProfileMenu = ({ anchorEl, open, onClose, onLogout, onEditProfile }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate('/dashboard');
    }
    onClose();
  };

  const menuItems = [
    { icon: <Settings className="w-4 h-4" />, label: "Settings", action: () => { navigate('/settings'); onClose(); } },
    { icon: <Users className="w-4 h-4" />, label: "Edit Profile", action: handleEditProfile },
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

export default ProfileMenu;
