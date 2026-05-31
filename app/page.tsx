"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthNavbar from "@/components/layout/auth-navbar";
import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/components/marketing/hero-section";
import FeaturedGallerySection from "@/components/marketing/featured-gallery-section";
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

      {/* Featured Packaging Gallery — visual proof, shown early */}
      <FeaturedGallerySection />

      {/* How It Works - Simple Timeline */}
      <section id="about" className="py-24 px-6 bg-[#FCFBF7] border-t border-[#E5E4E0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-[#737373] max-w-2xl mx-auto">
              From concept to print-ready design in four simple steps
            </p>
          </motion.div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                <div className="bg-white rounded-2xl border border-[#E5E4E0] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#F97316] rounded-xl flex items-center justify-center mb-5">
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
      <section className="py-24 px-6 bg-[#FCFBF7] border-t border-[#E5E4E0]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-3xl p-12 md:p-16 overflow-hidden"
          >
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
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
