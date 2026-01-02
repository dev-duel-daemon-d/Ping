import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Gamepad2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const isLogin = location.pathname === "/login";

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
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent animate-scan" />
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[400px] h-[400px] bg-yellow-500/20 rounded-full filter blur-[100px] pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 200}px`,
          top: `${mousePos.y - 200}px`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 group cursor-pointer">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <Gamepad2 className="w-10 h-10 text-yellow-400 transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Ping
            </h1>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-black/50 backdrop-blur-md rounded-xl border border-yellow-500/30 mb-6 relative">
          <Link to="/login" className="flex-1 relative z-10">
            <button
              className={`w-full py-3 text-sm font-bold rounded-lg transition-colors ${isLogin ? "text-black" : "text-gray-400 hover:text-yellow-400"}`}
            >
              Login
            </button>
          </Link>
          <Link to="/register" className="flex-1 relative z-10">
            <button
              className={`w-full py-3 text-sm font-bold rounded-lg transition-colors ${!isLogin ? "text-black" : "text-gray-400 hover:text-yellow-400"}`}
            >
              Register
            </button>
          </Link>

          {/* Animated Background for Tab */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg transition-transform duration-300 ease-in-out ${isLogin ? "translate-x-0" : "translate-x-[calc(100%+8px)]"}`}
          />
        </div>

        {/* Forms Container */}
        <div className="relative overflow-hidden h-[600px] glass-card shadow-2xl shadow-yellow-500/10 flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-8 w-full"
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-8 w-full"
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl  font-bold text-center  mb-20 text-white">
        Welcome Back
      </h2>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200 animate-pulse-fast">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="pro.gamer@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Create Account
      </h2>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200 animate-pulse-fast">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="GamerTag123"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="pro.gamer@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Profile...</span>
            </>
          ) : (
            "Join the Squad"
          )}
        </button>
      </form>
    </>
  );
};

export default AuthPage;
