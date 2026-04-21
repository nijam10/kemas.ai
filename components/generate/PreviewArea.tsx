"use client";
import React from "react";
import { motion } from "framer-motion";
import { DotPattern } from "../ui/Effects";

interface PreviewProps {
  data: { productName: string; brandName: string; geometry: string };
}

export default function PreviewArea({ data }: PreviewProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-transparent perspective-[1200px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white/60 backdrop-blur-sm w-full max-w-lg aspect-[3/4] rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center relative border border-zinc-200/60 overflow-hidden"
      >
        <DotPattern className="text-zinc-300 opacity-40" />

        <motion.span
          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 right-8 text-brand-accent text-lg opacity-30"
        >
          ✦
        </motion.span>
        <motion.span
          animate={{ rotate: [360, 180, 0], scale: [1, 0.8, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-8 left-8 text-brand-accent text-sm opacity-20"
        >
          ✦
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-64 h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center mb-10 relative group overflow-hidden z-10"
          style={{
            borderColor: "rgba(228, 171, 90, 0.3)",
            background: "linear-gradient(180deg, rgba(228,171,90,0.12) 0%, rgba(39,44,53,0.08) 100%)",
          }}
        >
          <div className="absolute inset-0 shimmer" />

          <div className="z-10 flex flex-col items-center text-center px-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 shadow-sm border border-white/30"
            >
              <span className="text-2xl">📦</span>
            </motion.div>

            <motion.h2
              key={data.productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-extrabold text-brand-navy leading-tight tracking-tight"
            >
              {data.productName || "Your Product"}
            </motion.h2>
            <motion.p
              key={data.brandName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-zinc-500 mt-1.5 font-medium"
            >
              {data.brandName || "Brand Name"}
            </motion.p>
          </div>

          <motion.div
            key={data.geometry}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-5 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full text-[9px] font-black text-brand-navy uppercase tracking-[0.2em] shadow-sm"
          >
            {data.geometry} Mockup
          </motion.div>
        </motion.div>

        <div className="text-center px-8 z-10">
          <h4 className="text-base font-bold text-brand-navy tracking-tight">Live Preview</h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            Click &quot;Generate Design&quot; to create your packaging
          </p>
        </div>
      </motion.div>
    </div>
  );
}
