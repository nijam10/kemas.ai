"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthNavbar from "@/components/layout/auth-navbar";
import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/components/marketing/hero-section";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import FAQSection from "@/components/marketing/faq-section";
import TrustedBySection from "@/components/marketing/trusted-by-section";
import {
  Download,
  ArrowRight,
  CheckCircle2,
  Edit,
  Eye,
  Box,
  Package,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      {/* Site Navbar */}
      <AuthNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Packaging Gallery */}
      <section className="py-16 px-6 bg-white border-t border-[#E5E4E0]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
              Packaging Gallery
            </h2>
            <p className="text-base text-[#737373] max-w-2xl mx-auto">
              Real packaging designs created by UMKM businesses using Kemas.ai
            </p>
          </motion.div>

          {/* Empty state — shown until real generated designs exist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20 px-6 bg-[#FCFBF7] rounded-2xl border border-[#E5E4E0]"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-[#F97316]/50" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              Design examples will appear here soon
            </h3>
            <p className="text-sm text-[#737373] text-center max-w-sm mb-8">
              Be among the first to generate packaging designs with Kemas.ai and see your work featured here.
            </p>
            <Link href="/generate">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#F97316] rounded-lg hover:bg-[#F97316]/90 transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                Create the First Design
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Simple Timeline */}
      <section id="about" className="py-16 px-6 bg-[#FCFBF7]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
              How It Works
            </h2>
            <p className="text-base text-[#737373] max-w-2xl mx-auto">
              From concept to print-ready design in four simple steps
            </p>
          </motion.div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Input Prompt",
                description: "Describe your packaging vision",
                icon: Edit,
              },
              {
                number: "02",
                title: "AI Generation",
                description: "Our AI creates your design",
                icon: Box,
              },
              {
                number: "03",
                title: "Preview & Edit",
                description: "Review in 3D and adjust",
                icon: Eye,
              },
              {
                number: "04",
                title: "Export",
                description: "Download print-ready files",
                icon: Download,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-xl border border-[#E5E4E0] p-6 hover:shadow-md transition-all duration-300">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-xs font-bold text-[#F97316] mb-2">{step.number}</div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-16 px-6 bg-[#FCFBF7]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl p-12 overflow-hidden"
          >
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                Start Designing Today
              </h2>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Join Indonesian UMKM businesses creating professional packaging with AI
              </p>

              <Link href="/generate">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 text-base font-bold text-[#F97316] bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  Create Your First Design
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>40 free credits</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
