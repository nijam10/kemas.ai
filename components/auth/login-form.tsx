"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full"
    >
      {/* Auth Card - Compact */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-[#E5E4E0]/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
        {/* Google Sign In */}
        <motion.button
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full bg-[#1A1A1A] text-white rounded-full py-3 px-6 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-[#2A2A2A] transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider - Compact */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E4E0] to-transparent" />
          <span className="text-[10px] font-medium text-[#A3A3A3] uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E4E0] to-transparent" />
        </div>

        {/* Login Form - Compact */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3] transition-colors duration-200 group-focus-within:text-[#F97316]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9F8F6] border-2 border-transparent rounded-xl text-[#1A1A1A] text-sm placeholder:text-[#A3A3A3] focus:outline-none focus:bg-white focus:border-[#F97316] transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3] transition-colors duration-200 group-focus-within:text-[#F97316]" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9F8F6] border-2 border-transparent rounded-xl text-[#1A1A1A] text-sm placeholder:text-[#A3A3A3] focus:outline-none focus:bg-white focus:border-[#F97316] transition-all duration-200"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#F97316] hover:text-[#E86305] transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#F97316] to-[#FACC15] text-white rounded-full py-3 px-6 font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group mt-5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        {/* Auto-registration Notice - Compact */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-[#A3A3A3] leading-relaxed">
            Account created automatically on first sign in
          </p>
        </div>
      </div>
    </motion.div>
  );
}
