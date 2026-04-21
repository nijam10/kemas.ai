"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ExploreGallery from "@/components/home/ExploreGallery";
import Footer from "@/components/layout/Footer";
import SignInModal from "@/components/auth/SignInModal";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Animations";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <main className="relative min-h-screen bg-brand-bg">
      <Navbar />

      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-[800px] w-full bg-gradient-to-b from-amber-50/30 via-white/50 to-brand-bg" />

      <Hero />

      <FadeIn>
        <div className="relative z-20 -mt-10 flex justify-center pb-8">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="dark"
              size="lg"
              onClick={() => router.push("/generate")}
              className="shadow-[0_20px_60px_rgba(29,36,45,0.25)] px-10"
            >
              <Sparkles className="h-4 w-4 text-brand-accent" />
              Create packaging with AI
            </Button>
          </motion.div>
        </div>
      </FadeIn>

      <ExploreGallery />
      <Footer />

      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </main>
  );
}
