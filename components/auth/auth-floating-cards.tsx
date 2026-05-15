"use client";

import { motion } from "framer-motion";
import { Box, Layers } from "lucide-react";

export default function AuthFloatingCards() {
  return (
    <>
      {/* 3D Preview Card - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="hidden 2xl:block absolute top-[18%] right-[8%] z-20"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E4E0]/50 p-4 shadow-xl w-44"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#737373]">3D Preview</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">Ready to view</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Logo Compositing Card - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="hidden 2xl:block absolute bottom-[22%] left-[8%] z-20"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E4E0]/50 p-4 shadow-xl w-52"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FACC15] to-[#F97316] rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#737373]">Logo Compositing</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">Placement locked</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Generation Status Card - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ duration: 0.8, delay: 1 }}
        className="hidden 2xl:block absolute bottom-[28%] right-[8%] z-20"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E4E0]/50 p-4 shadow-xl w-48"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#737373]">Last Generation</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-[#1A1A1A]">Cassava Chips</p>
            <p className="text-xs text-[#737373]">Completed in 12s</p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
