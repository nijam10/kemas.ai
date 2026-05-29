"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import AuthNavbar from "@/components/layout/auth-navbar";
import {
  Box,
  RotateCw,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  Package,
  Info,
  Lightbulb,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DesignStatus {
  designId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  currentStep: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPackagingLabel(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STEP_LABELS: Record<string, string> = {
  CREDIT_CHECK: "Checking credits",
  API_GATEWAY: "Connecting to server",
  COMFYUI_PIPELINE: "Generating design",
  LORA_STYLE: "Applying style",
  LOGO_COMPOSITING: "Compositing logo",
  OUTPUT_READY: "Finalising output",
  PREVIEW_READY: "Ready",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const designId = params.id;

  // Design data from /api/designs (for title, packagingType, createdAt)
  const [designMeta, setDesignMeta] = useState<{
    title: string;
    packagingType: string;
    createdAt: string;
  } | null>(null);

  // Live status from polling
  const [statusData, setStatusData] = useState<DesignStatus | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 3D viewer state
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);

  // ── Fetch design metadata ─────────────────────────────────────────────────
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch(`/api/designs?pageSize=100`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) {
          const found = json.data.designs.find(
            (d: { id: string; title: string; packagingType: string; createdAt: string }) =>
              d.id === designId
          );
          if (found) {
            setDesignMeta({
              title: found.title,
              packagingType: found.packagingType,
              createdAt: found.createdAt,
            });
          }
        }
      } catch {
        // silently ignore
      } finally {
        setLoadingMeta(false);
      }
    }
    loadMeta();
  }, [designId]);

  // ── Poll status ───────────────────────────────────────────────────────────
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/generate/${designId}/status`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success) {
        const data = json.data as DesignStatus;
        setStatusData(data);

        // Stop polling when terminal
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      }
    } catch {
      // silently ignore network errors during polling
    }
  }, [designId]);

  useEffect(() => {
    // Initial poll immediately
    pollStatus();

    // Then poll every 4 seconds while processing
    pollRef.current = setInterval(pollStatus, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollStatus]);

  // ── 3D viewer handlers ────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotationY;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotationY(
      dragStartRotation.current + (e.clientX - dragStartX.current) * 0.5
    );
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleRotateLeft = () => setRotationY((p) => p - 45);
  const handleRotateRight = () => setRotationY((p) => p + 45);
  const handleZoomIn = () => setZoom((p) => Math.min(p + 0.2, 2));
  const handleZoomOut = () => setZoom((p) => Math.max(p - 0.2, 0.5));
  const handleReset = () => {
    setRotationY(0);
    setZoom(1);
  };

  const isProcessing =
    !statusData ||
    statusData.status === "PROCESSING";
  const isFailed = statusData?.status === "FAILED";
  const isCompleted = statusData?.status === "COMPLETED";
  const imageUrl = statusData?.imageUrl ?? null;
  const currentStep = statusData?.currentStep ?? "API_GATEWAY";
  const stepLabel = STEP_LABELS[currentStep] ?? currentStep;

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A]">
                  Packaging Preview
                </h1>
                <p className="text-sm text-[#737373]">
                  {isProcessing
                    ? "Generating your design…"
                    : isCompleted
                    ? "Your design is ready"
                    : "Generation failed"}
                </p>
              </div>
            </div>

            {/* Status badge */}
            {isProcessing && (
              <span className="flex items-center gap-2 px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full text-xs font-semibold text-[#F97316]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {stepLabel}
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full text-xs font-semibold text-green-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
            {isFailed && (
              <span className="flex items-center gap-2 px-3 py-1 bg-red-100 border border-red-200 rounded-full text-xs font-semibold text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
                Failed
              </span>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FCFBF7] to-[#F5F5F0] border border-[#E5E4E0]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                perspective: "1200px",
              }}
            >
              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                    <Package className="w-10 h-10 text-[#F97316] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                      {stepLabel}…
                    </p>
                    <p className="text-xs text-[#737373]">
                      This usually takes 20–60 seconds
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#F97316] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Failed overlay */}
              {isFailed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <AlertCircle className="w-16 h-16 text-red-400" />
                  <div className="text-center px-8">
                    <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                      Generation failed
                    </p>
                    <p className="text-xs text-[#737373]">
                      {statusData?.errorMessage ??
                        "An error occurred. No credits were deducted."}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/generate")}
                    className="px-5 py-2 bg-[#F97316] text-white rounded-xl text-sm font-semibold hover:bg-[#F97316]/90 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Completed — show real image or 3D mockup */}
              {isCompleted && (
                <>
                  {!isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E5E4E0] rounded-full text-xs font-medium text-[#737373] flex items-center gap-2 pointer-events-none"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                        />
                      </svg>
                      Drag to rotate 360°
                    </motion.div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <motion.div
                      animate={{
                        y: isDragging ? 0 : [0, -10, 0],
                        scale: zoom,
                      }}
                      transition={{
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        scale: { duration: 0.3 },
                      }}
                      style={{
                        transform: `rotateY(${rotationY}deg)`,
                        transformStyle: "preserve-3d",
                        transition: isDragging
                          ? "none"
                          : "transform 0.3s ease-out",
                      }}
                      className="relative"
                    >
                      {imageUrl ? (
                        /* Real generated image */
                        <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-2xl">
                          <Image
                            src={imageUrl}
                            alt={designMeta?.title ?? "Generated packaging"}
                            fill
                            className="object-cover"
                            unoptimized // ComfyUI images are external
                          />
                        </div>
                      ) : (
                        /* Fallback 3D mockup if imageUrl missing */
                        <div className="relative w-72 h-96">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#F97316] to-[#FACC15] rounded-[2.5rem] shadow-2xl">
                            <div className="absolute inset-x-8 top-12 bottom-16 bg-white/95 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center">
                              <Package className="w-20 h-20 text-[#F97316] mb-3" />
                              <p className="text-lg font-bold text-[#1A1A1A] text-center">
                                {designMeta?.title ?? "Your Design"}
                              </p>
                            </div>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-[#F97316] to-[#F97316]/80 rounded-t-2xl shadow-md" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-[2.5rem]" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E5E4E0] rounded-xl text-xs font-medium text-[#737373]">
                    High Resolution
                  </div>
                </>
              )}
            </div>

            {/* Controls — only when completed */}
            {isCompleted && (
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleRotateLeft}
                  className="p-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/40 rounded-xl transition-all"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-5 h-5 text-[#1A1A1A]" />
                </button>
                <button
                  onClick={handleRotateRight}
                  className="p-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/40 rounded-xl transition-all"
                  title="Rotate Right"
                >
                  <RotateCw className="w-5 h-5 text-[#1A1A1A]" />
                </button>
                <div className="w-px h-8 bg-[#E5E4E0]" />
                <button
                  onClick={handleZoomOut}
                  className="p-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/40 rounded-xl transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-[#1A1A1A]" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/40 rounded-xl transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-[#1A1A1A]" />
                </button>
                <div className="w-px h-8 bg-[#E5E4E0]" />
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/40 rounded-xl text-sm font-medium text-[#1A1A1A] transition-all"
                >
                  Reset View
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Mockup Information */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  Design Information
                </h3>
              </div>
              {loadingMeta ? (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-[#F5F5F0] rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#A3A3A3] mb-1">
                      Packaging Name
                    </p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {designMeta?.title ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A3A3A3] mb-1">
                      Packaging Type
                    </p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {designMeta
                        ? formatPackagingLabel(designMeta.packagingType)
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A3A3A3] mb-1">Generated</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {designMeta
                        ? getRelativeTime(designMeta.createdAt)
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#A3A3A3] mb-1">Status</p>
                    <p
                      className={`text-sm font-semibold ${
                        isCompleted
                          ? "text-green-600"
                          : isFailed
                          ? "text-red-600"
                          : "text-[#F97316]"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isFailed
                        ? "Failed"
                        : stepLabel + "…"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Guide */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-[#FACC15]" />
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  Preview Guide
                </h3>
              </div>
              <div className="space-y-3 text-sm text-[#737373]">
                {[
                  {
                    n: 1,
                    bold: "Drag left or right",
                    rest: "to rotate the packaging 360°",
                  },
                  {
                    n: 2,
                    bold: "Use zoom controls",
                    rest: "to inspect details closely",
                  },
                  {
                    n: 3,
                    bold: "Download",
                    rest: "when you're ready to use the design",
                  },
                ].map(({ n, bold, rest }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#F97316]">
                        {n}
                      </span>
                    </div>
                    <p>
                      <span className="font-semibold text-[#1A1A1A]">
                        {bold}
                      </span>{" "}
                      {rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {isCompleted && imageUrl && (
                  <a
                    href={imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    <Download className="w-5 h-5" />
                    Download Design
                  </a>
                )}
                <button
                  onClick={() => router.push("/generate")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-semibold transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {isFailed ? "Try Again" : "Generate Another"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
