"use client";

import { motion } from "framer-motion";

export default function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FCFBF7]">
      {/* Cleaner ambient radial glows */}
      <div className="absolute inset-0">
        {/* Soft orange glow - top left */}
        <div className="absolute -top-[20%] -left-[15%] w-[700px] h-[700px] bg-[#F97316]/8 rounded-full blur-[140px]" />
        
        {/* Soft gold glow - bottom right */}
        <div className="absolute -bottom-[20%] -right-[15%] w-[600px] h-[600px] bg-[#FACC15]/6 rounded-full blur-[120px]" />
        
        {/* Subtle center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F97316]/5 rounded-full blur-[160px]" />
      </div>

      {/* Very subtle editorial texture */}
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1A1A1A 1px, transparent 1px),
            linear-gradient(to bottom, #1A1A1A 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#FCFBF7]/30" />

      {/* Minimal decorative particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Tiny dots */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[12%] w-1 h-1 bg-[#F97316] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.03, 0.07, 0.03],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[65%] right-[18%] w-1 h-1 bg-[#FACC15] rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -18, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[30%] left-[20%] w-0.5 h-0.5 bg-[#F97316] rounded-full"
        />

        {/* Tiny stars */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.07, 0.03],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[35%] right-[22%] text-[#F97316] text-[8px]"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[40%] left-[18%] text-[#FACC15] text-[7px]"
        >
          ✦
        </motion.div>
      </div>

      {/* Depth layers - fewer, softer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[12%] w-[350px] h-[350px] bg-white/8 rounded-full blur-[90px]" />
        <div className="absolute bottom-[20%] left-[18%] w-[300px] h-[300px] bg-white/7 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}
