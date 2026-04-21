"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="relative w-full max-w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden flex"
          >
            <div className="hidden lg:block w-[400px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 via-brand-bg to-brand-accent/10" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="space-y-6 text-center">
                  <div className="w-20 h-28 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mx-auto flex items-center justify-center border border-white/50">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="w-16 h-24 bg-brand-navy/80 backdrop-blur-sm rounded-2xl shadow-xl mx-auto flex items-center justify-center -mt-4 ml-12 rotate-6 border border-white/20">
                    <span className="text-2xl">🎨</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/80 to-transparent h-20" />
            </div>

            <div className="flex-1 p-8 sm:p-10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8">
                <span className="text-xl font-bold tracking-tight text-brand-navy">
                  Kemas<span className="text-brand-accent">.ai</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-brand-navy mb-2">
                Welcome Back to Kemas.ai
              </h2>
              <p className="text-sm text-zinc-500 mb-8">
                Sign in to continue elevating your snack brand&apos;s visual power.
              </p>

              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-zinc-200 bg-white text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 mb-6">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-xs text-zinc-400">or sign in with</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider block mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="input-field w-full pl-10"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">
                      Password
                    </label>
                    <button type="button" className="text-[11px] text-brand-accent font-semibold hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field w-full pl-10"
                    />
                  </div>
                </div>

                <Button variant="dark" size="lg" className="w-full rounded-xl mt-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-[11px] text-zinc-400 text-center mt-8">
                By signing in, you agree to our{" "}
                <a href="#" className="text-brand-accent hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-brand-accent hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
