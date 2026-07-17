"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AuthBackground from "@/components/auth/auth-background";

function OAuthErrorAlert() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams?.get("error") === "OAuthSignin") {
      alert("Login dibatalkan");
    }
  }, [searchParams]);
  return null;
}

// Google icon SVG (official brand asset)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <Suspense fallback={null}>
        <OAuthErrorAlert />
      </Suspense>
      {/* Premium Background System */}
      <AuthBackground />

      {/* Top-left Wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-5 left-5 md:top-6 md:left-8 z-20"
      >
        <Link href="/" className="fixed top-5 left-5 md:top-6 md:left-8 z-20">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#1A1A1A]">Kemas.</span>
            <span className="text-[#F97316]">ai</span>
          </span>
        </Link>
      </motion.div>

      {/* Floating Packaging Visuals */}
      <FloatingPackagingVisuals />

      {/* Centered Auth Content */}
      <div className="relative h-full flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-md px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-2 leading-[1.05]">
              Welcome to
              <br />
              <span className="text-[#F97316]">Kemas.ai</span>
            </h1>
            <p className="text-xs text-[#737373] max-w-xs mx-auto leading-relaxed mt-3">
              Sign in to start creating premium packaging designs for your brand.
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-white hover:bg-[#F5F5F0] border border-[#E5E4E0] rounded-xl p-5 hover:shadow-lg hover:border-[#F97316]/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-4">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-[#F97316]/30 border-t-[#F97316] rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-6 h-6 flex-shrink-0" />
                )}
                <span className="text-base font-semibold text-[#1A1A1A]">
                  {isLoading ? "Signing in…" : "Continue with Google"}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/0 via-[#F97316]/5 to-[#F97316]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Footer note */}
            <div className="pt-2 text-center">
              <p className="text-xs text-[#A3A3A3]">
                By signing in you agree to our{" "}
                <Link href="#" className="underline hover:text-[#1A1A1A] transition-colors">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline hover:text-[#1A1A1A] transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Legal Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-5 left-0 right-0 z-20"
      >
        <div className="flex items-center justify-center gap-4">
          <Link href="#" className="text-[10px] text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors">
            Terms
          </Link>
          <div className="w-0.5 h-0.5 bg-[#E5E4E0] rounded-full" />
          <Link href="#" className="text-[10px] text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors">
            Privacy
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Floating Packaging Visuals ────────────────────────────────────────────────

function FloatingPackagingVisuals() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="hidden xl:block absolute left-[8%] top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative opacity-40"
        >
          <div className="w-32 h-44 bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-600 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/30 rounded-full" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 space-y-1 text-center">
              <div className="h-1.5 w-16 bg-white/40 rounded-full mx-auto" />
              <div className="h-1 w-12 bg-white/30 rounded-full mx-auto" />
            </div>
            <div className="absolute top-2 right-2 w-4 h-4 border-2 border-white/20 rounded-lg rotate-12" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/10 blur-xl rounded-full" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden xl:block absolute right-[8%] top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="relative opacity-40"
        >
          <div className="w-28 h-40 bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 rounded-3xl rounded-t-[1.75rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/30 to-transparent" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center">
              <div className="w-7 h-7 bg-white/30 rounded-lg" />
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/3 left-2 w-14 h-14 border-2 border-white rounded-full" />
            </div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 space-y-0.5 text-center">
              <div className="h-1.5 w-16 bg-white/40 rounded-full mx-auto" />
              <div className="h-1 w-12 bg-white/30 rounded-full mx-auto" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/10 blur-xl rounded-full" />
        </motion.div>
      </motion.div>
    </>
  );
}
