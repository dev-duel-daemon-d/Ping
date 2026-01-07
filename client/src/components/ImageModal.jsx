import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  const [scale, setScale] = useState(1);
  
  // Reset scale when modal opens/closes
  React.useEffect(() => {
    if (isOpen) setScale(1);
  }, [isOpen]);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setScale(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-50">
            <button 
              onClick={handleZoomOut}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={24} />
            </button>
            <button 
              onClick={handleResetZoom}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 size={24} />
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={24} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-red-500/20 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-4"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
          >
            <motion.div
              style={{ scale }}
              className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
              drag={scale > 1} // Only enable drag when zoomed in
              dragConstraints={{ left: -100 * scale, right: 100 * scale, top: -100 * scale, bottom: 100 * scale }}
            >
              <img 
                src={imageSrc} 
                alt="Full view" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
