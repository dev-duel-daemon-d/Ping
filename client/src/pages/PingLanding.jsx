import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    Gamepad2, 
    Trophy, 
    Users, 
    Zap, 
    ArrowRight, 
    CheckCircle,
    Globe,
    Shield
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// --- Components ---

const Navbar = ({ isAuthenticated }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-lime-500 flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                    <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Ping</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#community" className="hover:text-white transition-colors">Community</a>
                <a href="#tournaments" className="hover:text-white transition-colors">Tournaments</a>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <Link to="/dashboard">
                        <button className="px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-lime-400 transition-colors">
                            Dashboard
                        </button>
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="hidden md:block text-slate-300 hover:text-white font-medium transition-colors">
                            Log in
                        </Link>
                        <Link to="/register">
                            <button className="px-5 py-2.5 bg-lime-500 text-black rounded-full font-semibold hover:bg-lime-400 transition-colors shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)]">
                                Get Started
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    </nav>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
    >
        <div className="w-12 h-12 rounded-2xl bg-lime-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-lime-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
);

const StatItem = ({ value, label }) => (
    <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
        <div className="text-slate-500 uppercase tracking-widest text-xs font-semibold">{label}</div>
    </div>
);

const PingLanding = () => {
    const { isAuthenticated } = useAuth();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-slate-200 selection:bg-lime-500/30 overflow-hidden font-sans">
            <Navbar isAuthenticated={isAuthenticated} />

            {/* --- Hero Section --- */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/20 via-black to-black" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                
                <div className="container max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-lime-400 font-medium mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                            </span>
                            The Professional Network for Gamers
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
                        >
                            Elevate your <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
                                Gaming Legacy
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Connect with elite players, showcase your stats, and get scouted by top teams. 
                            Ping is where champions are made and legends are born.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-lime-500 text-black rounded-full font-bold text-lg hover:bg-lime-400 transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    Start Your Career <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                                Explore Tournaments
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract Visual */}
                <motion.div 
                    style={{ y }}
                    className="absolute -bottom-1/2 left-0 right-0 h-[800px] bg-gradient-to-t from-lime-500/10 to-transparent blur-3xl pointer-events-none" 
                />
            </section>

            {/* --- Stats Section --- */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <StatItem value="50K+" label="Active Players" />
                        <StatItem value="200+" label="Verified Teams" />
                        <StatItem value="$1M+" label="Prize Pool" />
                        <StatItem value="24/7" label="Live Support" />
                    </div>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section id="features" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to go Pro</h2>
                        <p className="text-slate-400 text-lg">
                            We provide the infrastructure for you to focus on what matters most: your performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon={Users}
                            title="Team Management"
                            description="Create organizations, manage rosters, and schedule scrims with integrated calendar tools."
                            delay={0.1}
                        />
                        <FeatureCard 
                            icon={Trophy}
                            title="Tournament System"
                            description="Automated bracket generation, score reporting, and prize distribution for seamless events."
                            delay={0.2}
                        />
                        <FeatureCard 
                            icon={Globe}
                            title="Global Scouting"
                            description="Get discovered by international organizations through our advanced player search and stats analysis."
                            delay={0.3}
                        />
                        <FeatureCard 
                            icon={Zap}
                            title="Real-time Chat"
                            description="Instant communication with your team and opponents. Voice channels coming soon."
                            delay={0.4}
                        />
                        <FeatureCard 
                            icon={Shield}
                            title="Verified Stats"
                            description="Connect your game accounts to automatically verify rank and match history."
                            delay={0.5}
                        />
                        <FeatureCard 
                            icon={Gamepad2}
                            title="Multi-Game Support"
                            description="Whether you play FPS, MOBA, or Battle Royale, we have a home for your competitive journey."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* --- Big CTA --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-lime-500/5" />
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                        Ready to dominate the server?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Join the fastest growing community of competitive gamers. Create your profile today and take the first step towards pro play.
                    </p>
                    <Link to="/register">
                        <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-lime-400 transition-all hover:scale-105 shadow-2xl">
                            Join Ping Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="border-t border-white/10 bg-[#050505] pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center text-black">
                                    <Gamepad2 className="w-5 h-5" />
                                </div>
                                <span className="text-lg font-bold text-white">Ping</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                The premier destination for competitive gaming. Build your legacy with Ping.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Tournaments</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Teams</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Players</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">News</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-lime-500 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Partners</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-lime-500 transition-colors">Code of Conduct</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                        <p>&copy; 2026 Ping Inc. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Discord</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PingLanding;