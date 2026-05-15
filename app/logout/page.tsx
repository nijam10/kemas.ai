"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

// Legacy mock auth key — clear it on logout so old state doesn't linger
const LEGACY_AUTH_KEY = "kemas_auth_state";

export default function LogoutPage() {
  useEffect(() => {
    // Clear any legacy mock auth from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(LEGACY_AUTH_KEY);
    }
    // Sign out via Auth.js and redirect to homepage
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
          <LogOut className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Logging out…
        </h1>
        <p className="text-sm text-[#737373]">
          You'll be redirected to the homepage
        </p>
      </motion.div>
    </div>
  );
}
