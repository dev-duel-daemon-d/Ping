import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import { X } from 'lucide-react';

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

export default NavigationDialog;
