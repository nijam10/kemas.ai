"use client";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import ExploreGallery from "../components/home/ExploreGallery";
import Button from "../components/ui/Button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-brand-bg">
      <Navbar />

      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-[800px] w-full bg-gradient-to-b from-amber-50/30 via-white to-brand-bg" />

      <Hero />

      {/* Button Create Packaging - Sekarang identik warnanya */}
      <div className="relative z-20 -mt-8 flex justify-center">
        <Button
          variant="dark"
          size="lg"
          onClick={() => router.push("/generate")}
          className="shadow-[0_20px_50px_rgba(29,36,45,0.3)] px-10"
        >
          <Sparkles className="h-4 w-4 text-brand-accent fill-brand-accent/20" />
          Create packaging with AI
        </Button>
      </div>

      <ExploreGallery />
      <div className="h-32" />
    </main>
  );
}