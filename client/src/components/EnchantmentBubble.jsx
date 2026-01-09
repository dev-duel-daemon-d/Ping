import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * EnchantmentBubble - Comic-style thought bubble with enchanting animations
 * Uses app theme colors (lime green) with prominent but elegant animations
 */
const EnchantmentBubble = ({ count = 0, className = "" }) => {
    // Only show if count > 0
    if (count <= 0) return null;

    return (
        <div className={`absolute top-0 right-0 ${className}`} style={{ transform: 'translate(50%, -50%)' }}>
            <div className="relative w-32 h-24">
                {/* First small bubble (closest to avatar, bottom-left) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        delay: 0.1,
                    }}
                    className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full border-2 border-primary/80 bg-primary/10 shadow-lg shadow-primary/30"
                />

                {/* Second small bubble (middle, slightly larger) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                        delay: 0.2,
                    }}
                    className="absolute bottom-8 left-8 w-3.5 h-3.5 rounded-full border-2 border-primary/80 bg-primary/10 shadow-lg shadow-primary/30"
                />

                {/* Main thought bubble (horizontal oval at top-right) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: [1, 1.02, 1],
                        y: [0, -2, 0],
                    }}
                    transition={{
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        delay: 0.3,
                    }}
                    className="absolute top-0 right-0"
                >
                    {/* Outer glow effect */}
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 8px rgba(132, 204, 22, 0.4), 0 0 16px rgba(132, 204, 22, 0.2)",
                                "0 0 16px rgba(132, 204, 22, 0.6), 0 0 24px rgba(132, 204, 22, 0.3)",
                                "0 0 8px rgba(132, 204, 22, 0.4), 0 0 16px rgba(132, 204, 22, 0.2)",
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="px-4 py-2.5 border-2 border-primary/90 bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm relative overflow-hidden"
                        style={{
                            borderRadius: '50%',
                            width: '90px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Animated shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatDelay: 1,
                            }}
                            style={{ borderRadius: '50%' }}
                        />

                        {/* Content */}
                        <motion.div
                            className="flex items-center gap-1.5 relative z-10"
                            key={count}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            {/* Sparkle icon with rotation and glow */}
                            <motion.div
                                animate={{
                                    rotate: [0, 180, 360],
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{
                                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                                className="drop-shadow-[0_0_4px_rgba(132,204,22,0.6)]"
                            >
                                <Sparkles className="w-4 h-4 text-primary" fill="currentColor" />
                            </motion.div>
                            <span className="text-xs font-bold text-primary tabular-nums tracking-wide drop-shadow-[0_0_4px_rgba(132,204,22,0.4)]">
                                {count.toLocaleString()}
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default EnchantmentBubble;
