import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ExploreGallery from "@/components/home/ExploreGallery";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] selection:bg-amber-100 selection:text-amber-900 font-sans">
      <Navbar />

      {/* Background Decor (Subtle gradient) */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-amber-50/50 via-white to-[#FAFAFA] -z-10 pointer-events-none" />

      <Hero />

      {/* Middle Floating Button (From your reference) */}
      <div className="flex justify-center -mt-8 relative z-20">
        <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-medium shadow-xl hover:bg-zinc-800 transition">
          <Sparkles className="w-4 h-4" />
          Create packaging with AI
        </button>
      </div>

      <ExploreGallery />

      {/* Simple Footer spacing */}
      <div className="h-32"></div>
    </main>
  );
}
