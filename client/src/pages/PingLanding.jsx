import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ChevronRight,
  Star,
  Target,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const PingLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

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
    };
  }, []);

  const features = [
    {
      icon: <Gamepad2 className="w-12 h-12" />,
      title: "Gaming Portfolio",
      description:
        "Showcase your achievements, clips, and gaming journey with a professional profile",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Connect & Network",
      description:
        "Build meaningful connections with pro gamers, teams, and esports organizations",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Tournament Hub",
      description:
        "Discover, join, and track tournaments. Share your competitive experiences",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Real-time Updates",
      description:
        "Stay updated with the latest esports news, team announcements, and opportunities",
      color: "from-yellow-300 to-yellow-500",
    },
  ];

  const stats = [
    { number: "50K+", label: "Pro Gamers", icon: <Target /> },
    { number: "200+", label: "Esports Teams", icon: <Users /> },
    { number: "1000+", label: "Tournaments", icon: <Trophy /> },
    { number: "24/7", label: "Active Community", icon: <Sparkles /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Lightning Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-transparent animate-lightning"
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
        className="fixed w-[300px] h-[300px] bg-yellow-400 rounded-full filter blur-[80px] opacity-40 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y - 150}px`,
        }}
      />

      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-500 to-transparent animate-scan" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-lg border-b border-yellow-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <Gamepad2 className="w-10 h-10 text-yellow-400 transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Ping
            </span>
          </div>

          {/* <div className="hidden md:flex space-x-8"> */}
          {/*   {["Features", "Community", "Tournaments", "About"].map((item) => ( */}
          {/*     <button */}
          {/*       key={item} */}
          {/*       className="relative text-gray-300 hover:text-yellow-400 transition-colors group" */}
          {/*     > */}
          {/*       {item} */}
          {/*       <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300" /> */}
          {/*     </button> */}
          {/*   ))} */}
          {/* </div> */}

          <div className="flex space-x-4">
            <button className="px-6 py-2 text-white hover:text-yellow-400 transition-colors">
              <Link to={"/login"}>Login</Link>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 text-black">
              <Link to={"/register"}>Register</Link>
            </button>
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
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="space-y-8 animate-slide-in-left">
            <div className="inline-block px-4 py-2 bg-yellow-500 bg-opacity-20 rounded-full border border-yellow-500 border-opacity-50 animate-pulse-glow">
              <span className="text-yellow-400 font-semibold">Ping</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                Level Up Your
              </span>
              <br />
              <span className="text-white drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                Gaming Career
              </span>
              <br />
              <span className="text-5xl md:text-6xl bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                in Real-Time
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              The ultimate platform for professional gamers to showcase
              achievements, connect with teams, and build their esports legacy.
              Your gaming LinkedIn starts here.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-black">
                <span>Start Your Journey</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-8 py-4 bg-transparent border-2 border-yellow-500 rounded-full font-bold text-lg hover:bg-yellow-500 hover:bg-opacity-20 hover:shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 text-yellow-400">
                Watch Demo
              </button>
            </div>
          </div>

          {/* 3D Animated Graphics */}
          <div className="relative animate-slide-in-right">
            <div className="relative w-full h-[600px]">
              {/* Central Gaming Controller with Electric Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-40 h-40 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/80 animate-float">
                  <Gamepad2 className="w-24 h-24 text-black" />
                  <div className="absolute inset-0 bg-yellow-300 rounded-3xl blur-2xl opacity-60 animate-pulse-slow" />

                  {/* Electric sparks around controller */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-spark"
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
                      <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/70 hover:scale-125 transition-transform cursor-pointer">
                        <Icon className="w-10 h-10 text-black" />
                        <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-md opacity-50" />
                      </div>
                    </div>
                  </div>
                ),
              )}

              {/* Stats Cards */}
              <div className="absolute top-10 right-10 bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500 border-opacity-50 animate-slide-in-right animation-delay-1000 shadow-lg shadow-yellow-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse-fast shadow-lg shadow-yellow-400" />
                  <span className="text-sm text-yellow-200">
                    50K+ Active Users
                  </span>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500 border-opacity-50 animate-slide-in-left animation-delay-1500 shadow-lg shadow-yellow-500/30">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-yellow-200">
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
            <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
              Power-Up Your Profile
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to dominate the esports scene
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500 border-opacity-30 hover:border-opacity-100 hover:border-yellow-400 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer hover:shadow-2xl hover:shadow-yellow-500/40"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />

                <div
                  className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-yellow-500/50`}
                >
                  {React.cloneElement(feature.icon, {
                    className: "w-12 h-12 text-black",
                  })}
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-yellow-500/70">
                  {React.cloneElement(stat.icon, {
                    className: "w-8 h-8 text-black",
                  })}
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-lg group-hover:text-yellow-400 transition-colors">
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
            <h2 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Ready to Go Pro?
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-amber-600 blur-3xl opacity-40 animate-pulse" />
          </div>

          <p className="text-2xl text-gray-300">
            Join thousands of pro gamers building their legacy on Ping
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <button className="group px-12 py-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-yellow-500/70 transform hover:scale-110 transition-all duration-300 flex items-center space-x-3 text-black">
              <span>Join Ping Today</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-yellow-500 border-opacity-30">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gamepad2 className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
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
