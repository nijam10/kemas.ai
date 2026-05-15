"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Package } from "lucide-react";
import { FloatingCard } from "../ui/FloatingCard";
import { FadeIn } from "../ui/Animations";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-20 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 space-y-8 z-10">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-xs font-medium text-zinc-300 shadow-lg shadow-orange-500/10"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
              <span>Powered by FLUX.1 + LoRA</span>
            </motion.div>
          </FadeIn>

          {/* Main Headline */}
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
              Elevate Your Snack{" "}
              <br className="hidden sm:block" />
              Brand&apos;s{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 animate-gradient">
                  Visual Power
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.35}>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              Generate stunning, market-ready packaging designs and product mockups
              in seconds. Give your local business the premium look it deserves with AI-powered automation.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link href="/generate">
                <button className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-2xl shadow-orange-500/30 transition-all">
                  <Zap className="w-5 h-5" />
                  Start AI Design
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/services">
                <button className="flex items-center gap-2 px-8 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-zinc-800 font-semibold rounded-xl transition-all">
                  <Package className="w-5 h-5" />
                  View Services
                </button>
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.65}>
            <div className="flex items-center gap-8 pt-8 border-t border-zinc-800/50">
              <div>
                <p className="text-3xl font-bold text-white">174+</p>
                <p className="text-sm text-zinc-500">Texture Datasets</p>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div>
                <p className="text-3xl font-bold text-white">10k+</p>
                <p className="text-sm text-zinc-500">Designs Generated</p>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div>
                <p className="text-3xl font-bold text-white">99%</p>
                <p className="text-sm text-zinc-500">Client Satisfaction</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Side - Floating Cards */}
        <div className="flex-1 relative w-full min-h-[600px] hidden lg:block">
          {/* Main Product Card */}
          <FloatingCard delay={0.3} rotate={-3} className="absolute top-0 right-20">
            <div className="w-64 h-80 bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 p-3 overflow-hidden">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-zinc-900 flex flex-col items-center justify-center gap-3 relative border border-zinc-800/30">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                  <span className="text-3xl">🍿</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Premium Cassava Chips</p>
                  <p className="text-xs text-zinc-400 mt-1">Artisan Snack Collection</p>
                </div>
                <div className="absolute bottom-4 px-4 py-1.5 bg-zinc-800/80 backdrop-blur-md rounded-full text-[10px] font-bold text-zinc-300 uppercase tracking-widest border border-zinc-700/50">
                  AI Generated
                </div>
              </div>
            </div>
          </FloatingCard>

          {/* Secondary Card */}
          <FloatingCard delay={0.5} rotate={4} className="absolute top-32 right-80">
            <div className="w-56 h-72 bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 p-3 overflow-hidden">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-3 relative border border-zinc-700/30">
                <div className="w-14 h-14 rounded-xl bg-zinc-800 shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🍫</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Dark Chocolate</p>
                  <p className="text-xs text-zinc-500">Minimalist Edition</p>
                </div>
              </div>
            </div>
          </FloatingCard>

          {/* AI Prompt Card */}
          <FloatingCard delay={0.7} rotate={-2} className="absolute top-80 right-32">
            <div className="w-72 h-36 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 p-5 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">AI Design Studio</span>
              </div>
              <div className="text-xs text-zinc-400 bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/50">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  "Premium cassava chips packaging, modern minimalist design with gold accents..."
                </motion.span>
              </div>
            </div>
          </FloatingCard>

          {/* Status Indicator */}
          <FloatingCard delay={0.9} rotate={1} className="absolute bottom-20 right-8">
            <div className="px-5 py-3 bg-zinc-900/95 backdrop-blur-xl rounded-xl border border-zinc-800/50 shadow-2xl flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 ring-2 ring-zinc-900 shadow-lg" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 ring-2 ring-zinc-900 shadow-lg" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 ring-2 ring-zinc-900 shadow-lg" />
              </div>
              <div>
                <motion.p
                  className="text-xs font-semibold text-white"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Generating design...
                </motion.p>
                <p className="text-[10px] text-zinc-500">FLUX.1 Processing</p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}
