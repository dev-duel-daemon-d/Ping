import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Ghost } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { accentColor } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 overflow-hidden relative flex items-center justify-center px-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan" />
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none z-0 transition-opacity duration-300"
        style={{
          backgroundColor: accentColor,
          opacity: 0.2,
          left: `${mousePos.x - 200}px`,
          top: `${mousePos.y - 200}px`,
        }}
      />

      <div className="text-center relative z-10 glass-card p-12 max-w-lg w-full shadow-2xl shadow-primary/10 border-primary/30">
        <div className="flex justify-center mb-6">
          <Ghost className="w-24 h-24 text-primary animate-float" />
        </div>

        <h1 className="text-5xl lg:text-9xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-2">
          404
        </h1>

        <h2 className="text-3xl font-bold text-slate-100 mb-4 uppercase tracking-wider">
          Game Over
        </h2>

        <p className="text-slate-400 mb-8 text-lg">
          The map you are trying to access does not exist. You might have lagged
          out or the server is down.
        </p>

        <Link to="/" className="inline-block">
          <button className="btn-primary">
            <Home className="w-5 h-5" />
            <span>Respawn at Home</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;