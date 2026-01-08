import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Gamepad2, AlertCircle, Loader2, Mail, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [verificationEmail, setVerificationEmail] = useState(null);
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

  // Reset verification state when switching tabs
  useEffect(() => {
    setVerificationEmail(null);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-900/10 to-transparent animate-scan" />
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[400px] h-[400px] bg-lime-500/20 rounded-full filter blur-[100px] pointer-events-none z-0 transition-opacity duration-300"
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
              <Gamepad2 className="w-10 h-10 text-lime-400 transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-lime-500 blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 via-lime-400 to-lime-500 bg-clip-text text-transparent">
              Ping
            </h1>
          </Link>
        </div>

        {/* Tab Switcher - Hide when verifying */}
        {!verificationEmail && (
          <div className="flex p-1 bg-black/50 backdrop-blur-md rounded-xl border border-lime-500/30 mb-6 relative">
            <Link to="/login" className="flex-1 relative z-10">
              <button
                className={`w-full py-3 text-sm font-bold rounded-lg transition-colors ${isLogin ? "text-black" : "text-gray-400 hover:text-lime-400"}`}
              >
                Login
              </button>
            </Link>
            <Link to="/register" className="flex-1 relative z-10">
              <button
                className={`w-full py-3 text-sm font-bold rounded-lg transition-colors ${!isLogin ? "text-black" : "text-gray-400 hover:text-lime-400"}`}
              >
                Register
              </button>
            </Link>

            {/* Animated Background for Tab */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg transition-transform duration-300 ease-in-out ${isLogin ? "translate-x-0" : "translate-x-[calc(100%+8px)]"}`}
            />
          </div>
        )}

        {/* Forms Container */}
        <div className="relative overflow-hidden min-h-[500px] glass-card shadow-2xl shadow-lime-500/10 flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {verificationEmail ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-8 w-full"
              >
                <VerifyForm
                  email={verificationEmail}
                  onBack={() => setVerificationEmail(null)}
                />
              </motion.div>
            ) : isLogin ? (
              <motion.div
                key="login"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-8 w-full"
              >
                <LoginForm onNeedVerification={setVerificationEmail} />
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
                <RegisterForm onSuccess={setVerificationEmail} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const GoogleLoginButton = ({ onError }) => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
      onError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex justify-center py-2">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Google login failed.")}
        theme="filled_black"
        shape="pill"
        width="300"
      />
    </div>
  );
};

const LoginForm = ({ onNeedVerification }) => {
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
      const msg = err.response?.data?.message || "Login failed.";

      // Check if the error indicates unverified email
      if (
        err.response?.status === 401 &&
        err.response?.data?.isVerified === false
      ) {
        onNeedVerification(err.response.data.email || formData.email);
        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-center mb-6 text-white">
        Welcome Back
      </h2>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200 animate-pulse-fast">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Login */}
      <GoogleLoginButton onError={setError} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#1a1e22] text-gray-500 rounded-full">
            Or continue with email
          </span>
        </div>
      </div>

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

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
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
      const response = await register(
        formData.username,
        formData.email,
        formData.password,
      );

      // If auto-verified in development, login and redirect
      if (response.autoVerified) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        // Otherwise, show verification form
        onSuccess(formData.email);
      }
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

      {/* Google Login */}
      <GoogleLoginButton onError={setError} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#1a1e22] text-gray-500 rounded-full">
            Or register with email
          </span>
        </div>
      </div>

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

const VerifyForm = ({ email, onBack }) => {
  const navigate = useNavigate();
  const { verifyEmail, resendOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyEmail(email, otp);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Please check your code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOTP(email);
      setResendCooldown(60); // 60s cooldown
      setError(""); // Clear errors
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-lime-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-gray-400 text-sm">
          We sent a 6-digit code to{" "}
          <span className="text-lime-400">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200 animate-pulse-fast">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2 text-center">
            Enter Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
            className="input-field text-center text-2xl tracking-[0.5em] font-mono"
            placeholder="000000"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        <div className="flex flex-col items-center space-y-4 mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`text-sm flex items-center space-x-2 ${resendCooldown > 0 ? "text-gray-600 cursor-not-allowed" : "text-lime-400 hover:text-lime-300"}`}
          >
            <RefreshCw
              className={`w-4 h-4 ${resendCooldown === 0 ? "group-hover:rotate-180 transition-transform" : ""}`}
            />
            <span>
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend Code"}
            </span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 text-sm hover:text-white transition-colors"
          >
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
