"use client";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import ExploreGallery from "../components/home/ExploreGallery";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#FAFAFA] selection:bg-amber-100 selection:text-amber-900">
      {/* Pastikan Navbar.tsx ada di components/layout/Navbar.tsx */}
      <Navbar />

      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-[800px] w-full bg-gradient-to-b from-amber-50/50 via-white to-[#FAFAFA]" />

      <Hero />

      <div className="relative z-20 -mt-8 flex justify-center">
        <button
          onClick={() => router.push("/generate")}
          className="flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-4 text-sm font-medium text-white shadow-2xl transition hover:bg-zinc-800 hover:scale-105 active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          Create packaging with AI
        </button>
      </div>

      <ExploreGallery />

      <div className="h-32" />
    </main>
  );
}