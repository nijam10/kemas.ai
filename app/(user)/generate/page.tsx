"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/layout/auth-navbar";
import PromptPanel from "@/components/generation/prompt-panel";
import LogoUpload from "@/components/generation/logo-upload";
import PackagingTypeSelector from "@/components/generation/packaging-type-selector";
import GenerationPipeline from "@/components/generation/generation-pipeline";
import GenerationPreview from "@/components/generation/generation-preview";
import RecentHistoryPanel from "@/components/generation/recent-history-panel";
import { Package } from "lucide-react";

type GenerationState = "idle" | "generating" | "completed";

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [packagingType, setPackagingType] = useState("standing-pouch");
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [credits, setCredits] = useState(40);

  const canGenerate = prompt.trim().length > 0 && packagingType && credits >= 10;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerationState("generating");
  };

  const handleGenerationComplete = () => {
    setGenerationState("completed");
    setCredits((prev) => prev - 10);
  };

  const handleSave = () => {
    alert("Design saved to gallery!");
  };

  const handleDownload = () => {
    alert("Downloading design...");
  };

  const handlePreview3D = () => {
    // Navigate to dedicated preview page
    router.push("/preview/mock");
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A]">
                Create premium packaging in minutes
              </h1>
            </div>
          </div>
          <p className="text-[#737373] max-w-3xl">
            Describe your product, upload your logo, choose a packaging format, and let Kemas.ai prepare a market-ready visual concept.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full">
            <span className="text-xs font-semibold text-[#1A1A1A]">
              10 credits per generation
            </span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Input Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 space-y-6">
              <PromptPanel value={prompt} onChange={setPrompt} />
              <LogoUpload onUpload={setLogo} />
              <PackagingTypeSelector selected={packagingType} onSelect={setPackagingType} />

              {/* Generate Button */}
              <div className="pt-4 border-t border-[#E5E4E0]">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="w-full px-6 py-3.5 bg-[#F97316] hover:bg-[#F97316]/90 disabled:bg-[#E5E4E0] disabled:cursor-not-allowed text-white disabled:text-[#A3A3A3] rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                >
                  {credits < 10 ? "Not enough credits" : "Generate Design"}
                </button>
                <p className="text-xs text-center text-[#737373] mt-2">
                  {credits >= 10
                    ? "Uses 10 credits after successful generation"
                    : `You need ${10 - credits} more credits to generate`}
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Preview */}
          <div className="lg:col-span-5">
            {generationState === "idle" && (
              <div className="bg-white border border-[#E5E4E0] rounded-2xl p-12 h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                    <Package className="w-16 h-16 text-[#F97316]/40" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Your generated packaging will appear here
                  </h3>
                  <p className="text-sm text-[#737373]">
                    Start by writing a prompt and choosing a packaging type, then click generate.
                  </p>
                </div>
              </div>
            )}

            {generationState === "generating" && (
              <div className="bg-white border border-[#E5E4E0] rounded-2xl p-12 h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                    <Package className="w-16 h-16 text-[#F97316] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Generating your design
                  </h3>
                  <p className="text-sm text-[#737373]">
                    Watch the pipeline below to see the generation progress
                  </p>
                </div>
              </div>
            )}

            {generationState === "completed" && (
              <GenerationPreview
                prompt={prompt}
                packagingType={packagingType}
                onSave={handleSave}
                onDownload={handleDownload}
                onPreview3D={handlePreview3D}
              />
            )}
          </div>

          {/* Right Column - Recent History */}
          <div className="lg:col-span-3">
            <RecentHistoryPanel />
          </div>
        </div>

        {/* Generation Pipeline - Full Width Below Main Grid */}
        <div className="mt-6">
          <GenerationPipeline 
            isActive={generationState === "generating"} 
            onComplete={handleGenerationComplete}
          />
        </div>
      </div>
    </div>
  );
}
