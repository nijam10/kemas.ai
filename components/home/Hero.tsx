import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-12">
      {/* Left Content */}
      <div className="flex-1 space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
          <Sparkles className="w-3 h-3 text-amber-500" />
          LoRA-Powered Automation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
          Elevate Your Snack Brand&apos;s <br />
          <span className="text-amber-500">Visual Power.</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
          Generate stunning, market-ready packaging designs and product mockups
          in seconds. Give your local business the premium look it deserves.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <button className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition shadow-lg shadow-zinc-200">
            Start AI Design <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Visual Composition */}
      <div className="flex-1 relative w-full min-h-[500px] hidden lg:block">
        {/* Mockup images - using placeholder colors to simulate the floating cards */}
        <div className="absolute top-0 right-10 w-48 h-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transform rotate-3 transition hover:rotate-0 duration-300">
          <div className="w-full h-full bg-stone-200 rounded-xl flex items-center justify-center text-stone-500 text-sm">
            Snack Pouch 1
          </div>
        </div>

        <div className="absolute top-32 right-64 w-40 h-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 transform -rotate-6 transition hover:rotate-0 duration-300">
          <div className="w-full h-full bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
            Premium Box
          </div>
        </div>

        {/* AI Prompt Glass Card */}
        <div className="absolute bottom-20 right-0 w-72 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-gray-900">
              AI Design Prompt
            </span>
          </div>
          <p className="text-sm text-gray-600 bg-white/50 p-3 rounded-lg border border-gray-100">
            &quot;A premium, minimalist packaging for artisan cassava chips,
            warm amber tones...&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
