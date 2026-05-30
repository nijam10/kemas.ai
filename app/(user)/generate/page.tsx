"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/layout/auth-navbar";
import PromptPanel from "@/components/generation/prompt-panel";
import LogoUpload from "@/components/generation/logo-upload";
import PackagingTypeSelector from "@/components/generation/packaging-type-selector";
import GenerationPipeline from "@/components/generation/generation-pipeline";
import OutputSettingsPanel from "@/components/generation/output-settings-panel";
import { useCredits } from "@/hooks/use-credits";
import { calculateCredits, type OutputFormat, type Resolution } from "@/lib/credits";
import { Package, AlertCircle, Loader2 } from "lucide-react";

type SubmitState = "idle" | "submitting" | "error";

export default function GeneratePage() {
  const router = useRouter();
  const { data: creditsData } = useCredits();

  const [prompt, setPrompt] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [packagingType, setPackagingType] = useState("standing-pouch");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("2d");
  const [resolution, setResolution] = useState<Resolution>("standard");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const balance = creditsData?.balance ?? 0;
  const totalCredits = calculateCredits({
    format: outputFormat,
    resolution,
  });
  const canGenerate =
    prompt.trim().length >= 10 && packagingType && balance >= totalCredits;

  const handleGenerate = async () => {
    if (!canGenerate || submitState === "submitting") return;

    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      // Use FormData so logo file can be included
      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      formData.append("packagingType", packagingType);
      if (logo) {
        formData.append("logo", logo);
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type — browser sets it with boundary automatically
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMessage(json.error ?? "Generation failed. Please try again.");
        setSubmitState("error");
        return;
      }

      const { designId } = json.data as { designId: string };
      router.push(`/preview/${designId}`);
    } catch {
      setErrorMessage(
        "Could not connect to the server. Please check your connection and try again."
      );
      setSubmitState("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A]">
                Create premium packaging in minutes
              </h1>
            </div>
          </div>
          <p className="text-[#737373] max-w-3xl">
            Describe your product, upload your logo, choose a packaging format,
            and let Kemas.ai generate a market-ready visual concept.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full">
            <span className="text-xs font-semibold text-[#1A1A1A]">
              Starts at 10 credits per generation
            </span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column — Input Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 space-y-4">
              <PromptPanel value={prompt} onChange={setPrompt} />
              <LogoUpload onUpload={setLogo} />
              <PackagingTypeSelector
                selected={packagingType}
                onSelect={setPackagingType}
              />

              {/* Error Banner */}
              {submitState === "error" && errorMessage && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {/* Generate Button */}
              <div className="pt-4 border-t border-[#E5E4E0]">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || submitState === "submitting"}
                  className="w-full px-6 py-3.5 bg-[#F97316] hover:bg-[#F97316]/90 disabled:bg-[#E5E4E0] disabled:cursor-not-allowed text-white disabled:text-[#A3A3A3] rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {submitState === "submitting" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting…
                    </>
                  ) : balance < totalCredits ? (
                    "Not enough credits"
                  ) : (
                    `Generate Design · ${totalCredits} credits`
                  )}
                </button>
                <p className="text-xs text-center text-[#737373] mt-2">
                  {balance >= totalCredits
                    ? `${totalCredits} credits will be deducted only after successful generation`
                    : `You need ${totalCredits - balance} more credits to generate`}
                </p>
              </div>
            </div>
          </div>

          {/* Center Column — Status / Idle */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-8 h-full flex items-center justify-center">
              {submitState === "submitting" ? (
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                    <Package className="w-12 h-12 text-[#F97316] animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    Submitting your request…
                  </h3>
                  <p className="text-sm text-[#737373]">
                    Connecting to the generation server. You'll be redirected
                    to the preview page automatically.
                  </p>
                </div>
              ) : (
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                    <Package className="w-12 h-12 text-[#F97316]/40" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    Your generated packaging will appear here
                  </h3>
                  <p className="text-sm text-[#737373]">
                    Write a prompt (at least 10 characters), optionally upload
                    your logo, choose a packaging type, then click Generate.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Output Settings */}
          <div className="lg:col-span-3">
            <OutputSettingsPanel
              format={outputFormat}
              resolution={resolution}
              totalCredits={totalCredits}
              onFormatChange={setOutputFormat}
              onResolutionChange={setResolution}
            />
          </div>
        </div>

        {/* Generation Pipeline — informational */}
        <div className="mt-4">
          <GenerationPipeline
            isActive={submitState === "submitting"}
            onComplete={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
