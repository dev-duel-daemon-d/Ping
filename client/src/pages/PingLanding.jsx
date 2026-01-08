import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  Target,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BentoGrid, BentoCard } from "../components/magicui/BentoGrid";
import { Globe } from "../components/magicui/Globe";
import { ConnectNetworkBeam } from "../components/ConnectNetworkBeam";
import { useAuth } from "../context/AuthContext";

const PingLanding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMobile);
    checkMobile();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          } else {
            entry.target.classList.remove("animate-in");
          }
        });
      },
      { threshold: 0.2 },
    );

    [featuresRef, statsRef, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const features = [
    {
      name: "Connect & Network",
      description:
        "Build meaningful connections with pro gamers, teams, and esports organizations.",
      href: "#",
      cta: "Learn more",
      background: (
        <ConnectNetworkBeam className="absolute inset-0 opacity-100" />
      ),
      className: "col-span-3 lg:col-span-2",
      color: "from-primary to-secondary",
    },
    {
      Icon: Users,
      name: "Gaming Portfolio",
      description:
        "Showcase your achievements, clips, and gaming journey with a professional profile.",
      href: "#",
      cta: "Connect",
      background: (
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 to-transparent opacity-50" />
      ),
      className: "col-span-3 lg:col-span-1",
      color: "from-primary to-secondary",
    },
    {
      Icon: Trophy,
      name: "Tournament Hub",
      description:
        "Discover, join, and track tournaments. Share your competitive experiences.",
      href: "#",
      cta: "Compete",
      background: (
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-transparent opacity-50" />
      ),
      className: "col-span-3 lg:col-span-1",
      color: "from-primary to-secondary",
    },
    {
      Icon: Zap,
      name: "Real-time Updates",
      description:
        "Stay updated with the latest esports news, team announcements, and opportunities.",
      href: "#",
      cta: "Stay Updated",
      background: (
        <Globe className="-top-20 left-auto -right-10 translate-x-0 origin-top-right scale-110 md:scale-125" />
      ),
      className: "col-span-3 lg:col-span-2 relative overflow-hidden",
      color: "from-primary to-primary",
    },
  ];

  const stats = [
    { number: "50K+", label: "Pro Gamers", icon: <Target /> },
    { number: "200+", label: "Esports Teams", icon: <Users /> },
    { number: "1000+", label: "Tournaments", icon: <Trophy /> },
    { number: "24/7", label: "Active Community", icon: <Sparkles /> },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-white overflow-hidden relative">
      {/* Animated Lightning Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-primary via-primary to-transparent animate-lightning"
            style={{
              left: `${20 + i * 20}%`,
              height: "100%",
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[300px] h-[300px] bg-primary rounded-full filter blur-[80px] opacity-40 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y - 150}px`,
        }}
      />

      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-scan" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark bg-opacity-80 backdrop-blur-lg border-b border-primary border-opacity-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <Gamepad2 className="w-10 h-10 text-primary transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
              Ping
            </span>
          </div>

          {/* <div className="hidden md:flex space-x-8"> */}
          {/*   {["Features", "Community", "Tournaments", "About"].map((item) => ( */}
          {/*     <button */}
          {/*       key={item} */}
          {/*       className="relative text-gray-300 hover:text-primary transition-colors group" */}
          {/*     > */}
          {/*       {item} */}
          {/*       <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" /> */}
          {/*     </button> */}
          {/*   ))} */}
          {/* </div> */}

          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 text-black">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-6 py-2 text-white hover:text-primary transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 text-black">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      >
        <div
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          style={{
            transform: !isMobile ? `translateY(${scrollY * 0.3}px)` : undefined,
          }}
        >
          <div className="space-y-8 animate-slide-in-left">
            <div className="inline-block px-4 py-2 bg-primary bg-opacity-20 rounded-full border border-primary border-opacity-50 animate-pulse-glow">
              <span className="text-primary font-semibold">Ping</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent animate-gradient">
                Level Up Your
              </span>
              <br />
              <span className="text-white drop-shadow-[0_0_30px_rgba(132,204,22,0.5)]">
                Gaming Career
              </span>
              <br />
              <span className="text-5xl md:text-6xl  from-primary to-primary bg-clip-text">
                in Real-Time
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              The ultimate platform for professional gamers to showcase
              achievements, connect with teams, and build their esports legacy.
              Your gaming LinkedIn starts here.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <button className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-black">
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button className="px-8 py-4 bg-transparent border-2 border-primary rounded-full font-bold text-lg hover:bg-primary hover:bg-opacity-20 hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 text-primary">
                Watch Demo
              </button>
            </div>
          </div>

          {/* 3D Animated Graphics */}
          <div className="relative animate-slide-in-right">
            <div className="relative w-full h-[400px] md:h-[600px]">
              {/* Central Gaming Controller with Electric Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-40 h-40 bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/80 animate-float">
                  <Gamepad2 className="w-24 h-24 text-black" />
                  <div className="absolute inset-0 bg-primary rounded-3xl blur-2xl opacity-60 animate-pulse-slow" />

                  {/* Electric sparks around controller */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-primary rounded-full animate-spark"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${i * 45}deg) translateX(80px)`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Orbiting Icons with Trails */}
              {[Trophy, Users, Target, Star, Zap, Sparkles].map(
                (Icon, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className="animate-orbit"
                      style={{
                        animationDelay: `${index * 1}s`,
                        animationDuration: "8s",
                      }}
                    >
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/70 hover:scale-125 transition-transform cursor-pointer">
                        <Icon className="w-10 h-10 text-black" />
                        <div className="absolute inset-0 bg-primary rounded-2xl blur-md opacity-50" />
                      </div>
                    </div>
                  </div>
                ),
              )}

              {/* Stats Cards */}
              <div className="absolute mt-20 top-10 right-10 bg-bg-dark bg-opacity-70 backdrop-blur-lg rounded-2xl p-4 border border-primary border-opacity-50 animate-slide-in-right animation-delay-1000 shadow-lg shadow-primary/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse-fast shadow-lg shadow-primary" />
                  <span className="text-sm text-lime-200">
                    50K+ Active Users
                  </span>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 bg-bg-dark bg-opacity-70 backdrop-blur-lg rounded-2xl p-4 border border-primary border-opacity-50 animate-slide-in-left animation-delay-1500 shadow-lg shadow-primary/30">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm text-lime-200">
                    1000+ Tournaments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative py-32 px-6 mt-20 scroll-animate"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(132,204,22,0.5)]">
              Power-Up Your Profile
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to dominate the esports scene
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-2">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-32 px-6 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/70">
                  {React.cloneElement(stat.icon, {
                    className: "w-8 h-8 text-black",
                  })}
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(132,204,22,0.5)]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-lg group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-32 px-6 scroll-animate">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
              Ready to Go Pro?
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-40 animate-pulse" />
          </div>

          <p className="text-2xl text-gray-300">
            Join thousands of pro gamers building their legacy on Ping
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <button className="group px-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-primary/70 transform hover:scale-110 transition-all duration-300 flex items-center space-x-3 text-black">
                <span>Join Ping Today</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-primary border-opacity-30">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Ping
            </span>
          </div>
          <p>© 2026 Ping. Level up your gaming career.</p>
        </div>
      </footer>
    </div>
  );
};

export default PingLanding;
