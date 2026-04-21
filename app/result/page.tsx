"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Edit3, RotateCcw, Box, Circle, Cylinder } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Animations";
import { DotPattern, GradientOrb } from "@/components/ui/Effects";

const mockupStyles = [
  { id: "pouch", label: "Pouch", icon: Box },
  { id: "box", label: "Box", icon: Box },
  { id: "can", label: "Can", icon: Cylinder },
];

export default function ResultPage() {
  const [activeStyle, setActiveStyle] = useState("pouch");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");

  return (
    <main className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <FadeIn>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Your Generated Design</h1>
            <p className="text-zinc-500">Review, preview, and download your packaging design</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FadeIn delay={0.15}>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 space-y-5">
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-1">Product Name</p>
                  <h2 className="text-xl font-bold text-brand-navy">Coffee Bag</h2>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-1">Brand Name</p>
                  <h3 className="text-lg font-semibold text-brand-navy">Batik Lapis</h3>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-1">Design Description</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    A modern minimalist stand-up pouch featuring warm golden tones with traditional
                    Batik-inspired accents. The layout emphasizes clean typography and negative space,
                    blending artisan heritage with contemporary packaging trends.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="md" className="flex-1 rounded-xl">
                  <Download className="w-4 h-4" />
                  Download High-Res 2D
                </Button>
                <Button variant="dark" size="md" className="flex-1 rounded-xl">
                  <Download className="w-4 h-4" />
                  Download 3D Render
                </Button>
                <Button variant="outline" size="md" className="rounded-xl">
                  <Edit3 className="w-4 h-4" />
                  Edit Design
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200/60 p-5">
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-3">Mockup Style:</p>
                <div className="flex gap-2">
                  {mockupStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStyle(style.id)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeStyle === style.id
                          ? "text-white"
                          : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {activeStyle === style.id && (
                        <motion.div
                          layoutId="mockup-style"
                          className="absolute inset-0 bg-brand-navy rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <style.icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{style.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="relative">
              <div className="bg-white rounded-3xl border border-zinc-200/60 overflow-hidden shadow-lg">
                <div className="flex border-b border-zinc-200/60">
                  {(["2d", "3d"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`relative flex-1 py-3 text-sm font-semibold transition-colors ${
                        viewMode === mode ? "text-brand-navy" : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      {viewMode === mode && (
                        <motion.div
                          layoutId="view-mode"
                          className="absolute bottom-0 inset-x-4 h-0.5 bg-brand-accent rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      {mode === "2d" ? "2D Flat View" : "3D Mockup View"}
                    </button>
                  ))}
                </div>

                <div className="relative aspect-square bg-gradient-to-br from-brand-bg via-white to-brand-bg flex items-center justify-center overflow-hidden">
                  <GradientOrb className="w-[300px] h-[300px] top-10 left-10 opacity-15" />
                  <DotPattern className="text-zinc-300 opacity-30" />

                  <motion.div
                    key={viewMode + activeStyle}
                    initial={{ opacity: 0, scale: 0.9, rotateY: viewMode === "3d" ? -20 : 0 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 w-48 h-64 rounded-2xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(228,171,90,0.25) 0%, rgba(39,44,53,0.15) 100%)",
                      boxShadow: viewMode === "3d"
                        ? "12px 12px 30px rgba(0,0,0,0.1), -4px -4px 20px rgba(255,255,255,0.8)"
                        : "0 4px 20px rgba(0,0,0,0.06)",
                      transform: viewMode === "3d" ? "perspective(800px) rotateY(-5deg) rotateX(2deg)" : "none",
                    }}
                  >
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand-navy">Kemas.ai</p>
                      <p className="text-xs text-zinc-500 mt-1">Premium Coffee</p>
                    </div>
                  </motion.div>

                  {viewMode === "3d" && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-brand-navy transition-colors z-20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>

              <p className="text-center text-[11px] text-zinc-400 mt-3">3D Mockup Preview</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
