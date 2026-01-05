import React from 'react';
import { Menu, MenuItem, Typography, Avatar, Button } from '@mui/material';
import { Check } from 'lucide-react';

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

export default NotificationMenu;
