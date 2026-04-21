"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloatingCard } from "../ui/FloatingCard";
import { FadeIn } from "../ui/Animations";
import { GradientOrb } from "../ui/Effects";
import Button from "../ui/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-36 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
      <GradientOrb className="w-[500px] h-[500px] -top-40 -left-40" />
      <GradientOrb className="w-[300px] h-[300px] top-20 right-20 opacity-10" />

      <div className="flex-1 space-y-8 z-10">
        <FadeIn delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            </motion.div>
            LoRA-Powered Automation
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-bold text-brand-navy leading-[1.05] tracking-tight">
            Elevate Your Snack{" "}
            <br className="hidden sm:block" />
            Brand&apos;s{" "}
            <span className="relative">
              <span className="text-gradient">Visual Power.</span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand-accent-dark rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
            Generate stunning, market-ready packaging designs and product mockups
            in seconds. Give your local business the premium look it deserves.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="flex items-center gap-4 pt-2">
            <Link href="/generate">
              <Button variant="dark" size="lg" className="group">
                Start AI Design
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>

      <div className="flex-1 relative w-full min-h-[520px] hidden lg:block perspective-[1200px]">
        <FloatingCard delay={0.3} rotate={4} className="absolute top-0 right-8">
          <div className="w-52 h-72 bg-white rounded-2xl shadow-xl border border-zinc-100/80 p-2.5 overflow-hidden">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 flex flex-col items-center justify-center gap-2 relative">
              <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🍿</span>
              </div>
              <p className="text-xs font-bold text-brand-navy">Premium Chips</p>
              <p className="text-[10px] text-zinc-400">Artisan Snack</p>
              <div className="absolute bottom-3 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                Pouch Mockup
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.5} rotate={-5} className="absolute top-28 right-72">
          <div className="w-44 h-60 bg-white rounded-2xl shadow-2xl border border-zinc-100/80 p-2.5 overflow-hidden">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-2 relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 shadow-sm flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">🍫</span>
              </div>
              <p className="text-xs font-bold text-white">Luxury Chocolate</p>
              <p className="text-[10px] text-zinc-400">Dark Minimalist</p>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.7} rotate={2} className="absolute top-64 right-36">
          <div className="w-48 h-32 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              </div>
              <span className="text-[11px] font-semibold text-brand-navy">AI Design Studio</span>
            </div>
            <div className="text-[11px] text-zinc-500 bg-white/60 p-2.5 rounded-lg border border-zinc-100">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                Premium cassava chips packaging, modern minimalist...
              </motion.span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.9} rotate={-2} className="absolute bottom-8 right-0">
          <div className="px-4 py-2.5 bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg flex items-center gap-3">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-green-400 ring-2 ring-white" />
              <div className="w-5 h-5 rounded-full bg-brand-accent ring-2 ring-white" />
              <div className="w-5 h-5 rounded-full bg-violet-400 ring-2 ring-white" />
            </div>
            <div>
              <motion.p
                className="text-[10px] font-semibold text-brand-navy"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Generating design...
              </motion.p>
            </div>
          </div>
        </FloatingCard>
      </div>
    </section>
  );
}
