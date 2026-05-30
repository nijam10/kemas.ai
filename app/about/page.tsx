"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthNavbar from "@/components/layout/auth-navbar";
import {
  Package,
  Zap,
  Layers,
  Box,
  ChevronDown,
  Github,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "High-Resolution Export", value: "Export Ready", icon: Box },
  { label: "Generation Speed", value: "10-20s", icon: Zap },
  { label: "Logo Compositing", value: "Precision", icon: Layers },
  { label: "Packaging Formats", value: "Multi-Type", icon: Package },
];

const journey = [
  {
    phase: "Research & Planning",
    description: "System architecture planning, LoRA experimentation, and workflow analysis.",
  },
  {
    phase: "Model Training",
    description: "FLUX.1 + LoRA fine-tuning for premium Indonesian packaging aesthetics.",
  },
  {
    phase: "Hybrid Pipeline",
    description: "Development of deterministic logo compositing and AI orchestration workflow.",
  },
  {
    phase: "Frontend Experience",
    description: "Building premium SaaS interface with Next.js and interactive preview systems.",
  },
];

const team = [
  {
    name: "Khairul Nizam",
    role: "Fullstack Developer",
    description: "Designing the bridge between premium UI experience and AI orchestration systems.",
    image: null,
  },
  {
    name: "Birgita",
    role: "Frontend Developer",
    description: "Crafting clean, elegant, and intuitive user experiences for modern creative workflows.",
    image: null,
  },
];

const faqs = [
  {
    question: "What is Kemas.ai?",
    answer: "Kemas.ai is a hybrid AI packaging generation platform designed specifically for Indonesian UMKM. We combine FLUX.1 diffusion models with deterministic logo compositing to create premium packaging visuals that preserve brand identity.",
  },
  {
    question: "How does AI packaging generation work?",
    answer: "Our system uses FLUX.1 with custom LoRA fine-tuning trained on premium Indonesian packaging aesthetics. The AI generates the overall design, while our compositing pipeline ensures your logo remains pixel-perfect and brand-accurate.",
  },
  {
    question: "Why use deterministic compositing?",
    answer: "AI models can distort logos during generation. Our hybrid approach generates beautiful packaging aesthetics with AI, then precisely composites your actual logo using deterministic algorithms. This ensures brand consistency and professional quality.",
  },
  {
    question: "Can I preview designs in 3D?",
    answer: "Yes! Every generated design includes an interactive 3D mockup preview where you can rotate, zoom, and inspect your packaging from all angles before downloading.",
  },
  {
    question: "Is the output ready for printing?",
    answer: "All designs are exported in high resolution with proper color profiles. While suitable for digital mockups and presentations, we recommend working with a print specialist for final production files.",
  },
  {
    question: "Can I reuse previous prompts?",
    answer: "Absolutely! Your generation history includes a 'Reuse Prompt' feature that lets you iterate on successful designs or maintain consistent visual direction across multiple products.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight mb-6">
                We Don't Just Generate Packaging
                <br />
                We Build{" "}
                <span className="bg-gradient-to-r from-[#F97316] to-[#FACC15] bg-clip-text text-transparent">
                  Brand Identity
                </span>
                .
              </h1>
              <p className="text-xl text-[#737373] mb-8 leading-relaxed">
                Kemas.ai helps Indonesian UMKM create premium packaging visuals using hybrid AI generation and precision compositing workflows.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#architecture"
                  className="px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  Explore Technology
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/generate"
                  className="px-6 py-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  Generate your first design
                </a>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] flex items-center justify-center"
            >
              <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
                {/* Floating Packaging Cards */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 left-1/4 w-48 h-64 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-3xl shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotateY: [0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-20 right-1/4 w-40 h-56 bg-gradient-to-br from-[#FACC15] to-[#F97316] rounded-3xl shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -25, 0],
                    rotateY: [0, 3, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-10 left-1/3 w-44 h-60 bg-gradient-to-br from-[#F97316]/80 to-[#FACC15]/80 rounded-3xl shadow-2xl backdrop-blur-sm"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl" />
                </motion.div>

                {/* Blur Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 via-transparent to-[#FACC15]/10 blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-[#E5E4E0]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              Kemas.ai in Numbers
            </h2>
            <p className="text-[#737373]">
              Technical specifications that power premium packaging generation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FCFBF7] border border-[#E5E4E0] rounded-2xl p-6 hover:shadow-lg hover:border-[#F97316]/20 transition-all"
              >
                <stat.icon className="w-8 h-8 text-[#F97316] mb-4" />
                <p className="text-3xl font-bold text-[#1A1A1A] mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-[#737373]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              Our Development Journey
            </h2>
            <p className="text-[#737373]">
              From concept to production-ready platform
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F97316] to-[#FACC15] hidden md:block" />

            <div className="space-y-8">
              {journey.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6 items-start"
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-[#E5E4E0] rounded-2xl p-6 hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      {item.phase}
                    </h3>
                    <p className="text-[#737373]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 bg-white border-y border-[#E5E4E0]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              How Kemas.ai Works
            </h2>
            <p className="text-[#737373]">
              Hybrid AI generation meets precision compositing
            </p>
          </motion.div>

          {/* Pipeline Visualization */}
          <div className="max-w-[1000px] mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[
                { label: "Prompt Input", icon: Sparkles },
                { label: "FLUX.1 Generation", icon: Zap },
                { label: "LoRA Adaptation", icon: Layers },
                { label: "Logo Compositing", icon: Package },
                { label: "High-Res Result", icon: CheckCircle2 },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center shadow-lg mb-3">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A] text-center">
                    {step.label}
                  </p>
                  {index < 4 && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="hidden md:block absolute w-16 h-0.5 bg-gradient-to-r from-[#F97316] to-[#FACC15]"
                      style={{
                        left: "50%",
                        transform: "translateX(40px)",
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Hybrid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              Why We Use Hybrid Generation
            </h2>
            <p className="text-[#737373]">
              AI generates aesthetics. Kemas.ai preserves brand precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Explanation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                The Logo Problem
              </h3>
              <p className="text-[#737373] mb-6 leading-relaxed">
                Diffusion models excel at generating beautiful packaging aesthetics, but they struggle with text and logo accuracy. Brand elements often become distorted, blurred, or completely unreadable.
              </p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Our Solution
              </h3>
              <p className="text-[#737373] mb-6 leading-relaxed">
                Kemas.ai uses a hybrid approach: AI generates the overall design aesthetic, then our deterministic compositing pipeline precisely places your actual logo with pixel-perfect accuracy. This ensures brand consistency while maintaining creative AI-generated visuals.
              </p>
              <div className="flex items-start gap-3 p-4 bg-[#F97316]/5 border border-[#F97316]/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#1A1A1A]">
                  <strong>Result:</strong> Premium AI-generated packaging with guaranteed brand accuracy.
                </p>
              </div>
            </motion.div>

            {/* Right: Visual Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {/* AI-Generated (Distorted) */}
              <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#F5F5F0] to-[#E5E4E0] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl font-bold text-[#A3A3A3] blur-sm">
                    LOGO
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                </div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                  AI-Generated
                </p>
                <p className="text-xs text-[#737373]">
                  Distorted logo, inconsistent branding
                </p>
              </div>

              {/* Kemas.ai (Precise) */}
              <div className="bg-white border-2 border-[#F97316] rounded-2xl p-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 rounded-xl mb-4 flex items-center justify-center relative">
                  <div className="text-4xl font-bold text-[#F97316]">
                    LOGO
                  </div>
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                  Kemas.ai
                </p>
                <p className="text-xs text-[#737373]">
                  Pixel-perfect logo, brand precision
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white border-y border-[#E5E4E0]">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              The Developers Behind Kemas.ai
            </h2>
            <p className="text-[#737373]">
              Building the future of Indonesian packaging design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FCFBF7] border border-[#E5E4E0] rounded-2xl p-8 hover:shadow-lg hover:border-[#F97316]/20 transition-all text-center"
              >
                {/* Avatar */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {member.name.charAt(0)}
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-[#F97316] mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-[#737373] leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white border border-[#E5E4E0] hover:border-[#F97316] flex items-center justify-center transition-all"
                  >
                    <Github className="w-4 h-4 text-[#1A1A1A]" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white border border-[#E5E4E0] hover:border-[#F97316] flex items-center justify-center transition-all"
                  >
                    <Linkedin className="w-4 h-4 text-[#1A1A1A]" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#737373]">
              Everything you need to know about Kemas.ai
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FCFBF7] transition-colors"
                >
                  <span className="text-lg font-semibold text-[#1A1A1A] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#F97316] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-[#737373] leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FCFBF7] via-[#FFF9F0] to-[#FCFBF7]">
        <div className="container mx-auto px-6 max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Ready to Build Better Packaging?
            </h2>
            <p className="text-xl text-[#737373] mb-8">
              Transform your snack brand into a premium visual experience with Kemas.ai.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/generate"
                className="px-8 py-4 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Generate your first design
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/gallery"
                className="px-8 py-4 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                Explore Gallery
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E4E0] py-12">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A1A1A]">Kemas.ai</span>
            </div>
            <p className="text-sm text-[#737373]">
              © 2024 Kemas.ai. Premium AI packaging for Indonesian UMKM.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#737373] hover:text-[#F97316] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#737373] hover:text-[#F97316] transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-[#737373] hover:text-[#F97316] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
