"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Box, Layers, CreditCard, Zap, Check } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center px-6 py-24 overflow-hidden bg-[#FCFBF7]">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#F97316]/8 via-[#FACC15]/4 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#FACC15]/6 to-transparent rounded-full blur-3xl opacity-40" />
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="max-w-[620px]"
          >
            {/* Headline - Premium Typography */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-8"
            >
              AI packaging studio for{" "}
              <span className="text-[#F97316]">Indonesian</span> snack brands
            </motion.h1>

            {/* Subcopy - Enhanced */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-[#737373] leading-[1.7] mb-10 max-w-[580px]"
            >
              Generate premium snack packaging concepts, place your logo precisely,
              preview it in 3D, and download high-resolution results — all in one
              simple workflow.
            </motion.p>

            {/* Premium CTA */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <Link href="/generate">
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    y: -3,
                    boxShadow: "0 12px 40px rgba(249, 115, 22, 0.28)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-5 bg-[#F97316] text-white rounded-full font-semibold text-base shadow-lg hover:bg-[#F97316]/90 transition-all duration-300 flex items-center gap-3"
                  style={{
                    boxShadow: "0 8px 24px rgba(249, 115, 22, 0.25)"
                  }}
                >
                  Create packaging with AI
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>

            {/* Micro Text */}
            <motion.p
              variants={fadeInUp}
              className="text-sm text-[#737373] flex items-center gap-2 flex-wrap"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                40 daily credits
              </span>
              <span className="text-[#E5E4E0]">•</span>
              <span>10 credits per generation</span>
              <span className="text-[#E5E4E0]">•</span>
              <span>3D preview ready</span>
            </motion.p>
          </motion.div>

          {/* Right: Premium Floating UI Composition */}
          <div className="relative h-[650px] hidden lg:block">
            {/* Main Packaging Preview Card - Premium Depth */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: 0,
                y: [0, -12, 0],
              }}
              transition={{ 
                duration: 0.8,
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[440px] bg-white rounded-[32px] border border-[#E5E4E0] shadow-2xl p-8 z-10"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(249, 115, 22, 0.06)"
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#F97316]/8 via-[#FACC15]/5 to-transparent rounded-3xl flex items-center justify-center relative overflow-hidden">
                {/* Premium Packaging Mockup */}
                <div className="relative">
                  {/* Realistic Pouch Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 blur-xl transform translate-y-8" />
                  
                  {/* Main Pouch */}
                  <motion.div 
                    animate={{ 
                      rotateY: [0, 2, 0],
                      rotateZ: [-2, -1, -2]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-44 h-60 bg-gradient-to-br from-[#F97316] via-[#F97316] to-[#ea580c] rounded-3xl shadow-2xl"
                    style={{
                      boxShadow: "0 25px 50px rgba(249, 115, 22, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    {/* Pouch Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl" />
                    
                    {/* Logo Area */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/95 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-2xl font-bold text-[#F97316]">K</div>
                    </div>
                    
                    {/* Product Name */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <div className="text-white/90 text-xs font-semibold tracking-wide">PREMIUM</div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Premium Label */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-[#E5E4E0]/50 shadow-lg">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Premium Cassava Chips</p>
                  <p className="text-xs text-[#737373] mt-0.5">Standing Pouch • 250g • AI Generated</p>
                </div>
              </div>
            </motion.div>

            {/* AI Prompt Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -2 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                rotate: -1,
                y: [0, -8, 0]
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.2,
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-8 left-0 w-[300px] bg-white rounded-3xl border border-[#E5E4E0] shadow-xl p-5 z-20"
              style={{
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-[#1A1A1A]">AI Prompt</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />
                      <span className="text-xs text-[#10b981]">Active</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    "Premium cassava chips packaging, warm editorial style, Indonesian aesthetic..."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Logo Compositing Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 2 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                rotate: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.3,
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-28 right-0 w-[260px] bg-white rounded-3xl border border-[#E5E4E0] shadow-xl p-5 z-15"
              style={{
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-xl flex items-center justify-center shadow-sm">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Logo Compositing</p>
                  <p className="text-xs text-[#737373]">Deterministic placement</p>
                </div>
                <Check className="w-4 h-4 text-[#10b981]" />
              </div>
              <div className="h-1 bg-[#F3F2EE] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {/* 3D Preview Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -1 }}
              animate={{ 
                opacity: 1, 
                y: [0, -12, 0],
                rotate: -0.5
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.4,
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute bottom-28 left-4 w-[240px] bg-white rounded-3xl border border-[#E5E4E0] shadow-xl p-5 z-15"
              style={{
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3F2EE] to-[#E5E4E0] rounded-xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Box className="w-6 h-6 text-[#F97316]" />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">3D Mockup</p>
                  <p className="text-xs text-[#737373]">360° interactive view</p>
                </div>
              </div>
            </motion.div>

            {/* Credit Usage Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: 1,
                y: [0, -8, 0]
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.5,
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute bottom-8 right-8 w-[200px] bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white rounded-3xl shadow-2xl p-5 z-15"
              style={{
                boxShadow: "0 12px 40px rgba(249, 115, 22, 0.3)"
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">10 credits used</p>
                  <p className="text-xs opacity-90 mt-0.5">30 remaining today</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Visual - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden w-full max-w-[420px] mx-auto h-[460px] bg-white rounded-[32px] border border-[#E5E4E0] shadow-2xl p-8"
            style={{
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#F97316]/8 via-[#FACC15]/5 to-transparent rounded-3xl flex items-center justify-center relative overflow-hidden">
              <div className="relative">
                <div className="w-36 h-52 bg-gradient-to-br from-[#F97316] via-[#F97316] to-[#ea580c] rounded-3xl shadow-2xl"
                  style={{
                    boxShadow: "0 25px 50px rgba(249, 115, 22, 0.3)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-xl font-bold text-[#F97316]">K</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-[#E5E4E0]/50 shadow-lg">
                <p className="text-sm font-semibold text-[#1A1A1A]">AI Packaging Studio</p>
                <p className="text-xs text-[#737373] mt-0.5">Generate • Preview • Download</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
