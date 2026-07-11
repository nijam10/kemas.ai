"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import type { PackagingTemplate } from "@/lib/gallery-templates";
import { packagingTypeLabel } from "./packaging-type-filter";
import { PACKAGING_ICONS } from "@/components/icons/packaging-icons";
import { cn } from "@/lib/utils";

interface TemplateDetailModalProps {
  template: PackagingTemplate | null;
  onClose: () => void;
}

export default function TemplateDetailModal({
  template,
  onClose,
}: TemplateDetailModalProps) {
  const [entered, setEntered] = useState(false);

  // Lock body scroll + close on Escape while the modal is open; trigger entrance.
  useEffect(() => {
    if (!template) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    // Flip to the "entered" state on the next frame so CSS transitions play.
    const raf = requestAnimationFrame(() => setEntered(true));

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      setEntered(false);
    };
  }, [template, onClose]);

  if (!template) return null;

  const normalizedType = template.packagingType.toLowerCase().replace(/_/g, "-");
  const Silhouette = PACKAGING_ICONS[normalizedType] || PACKAGING_ICONS[template.packagingType];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out",
        entered ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} details`}
    >
      <div
        className={cn(
          "relative w-full max-w-[900px] max-h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all duration-200 ease-out",
          entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#737373] hover:bg-[#E5E4E0] hover:text-[#1A1A1A] transition-all duration-300 ease-out"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left column — image or fallback (~60%) */}
        <div
          className="relative md:w-3/5 aspect-[4/5] md:aspect-auto md:min-h-[420px] flex items-center justify-center overflow-hidden bg-[#F5F5F0]"
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${template.gradientFrom || '#F97316'}, ${template.gradientTo || '#FACC15'})`,
            }}
          />
          {Silhouette && (
            <Silhouette className="relative z-10 h-[45%] w-auto text-white/40" strokeWidth={2} />
          )}

          {(template.thumbnailUrl || template.fullImageUrl) && (
            <img 
              src={template.thumbnailUrl || template.fullImageUrl} 
              alt={template.name}
              className="absolute inset-0 w-full h-full object-cover z-20"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>

        {/* Right column — info (~40%) */}
        <div className="md:w-2/5 p-6 overflow-y-auto">
          <h2 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
            {template.name}
          </h2>
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-xs font-semibold text-[#F97316]">
            {packagingTypeLabel(template.packagingType)}
          </span>

          {/* Description */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wide text-[#A3A3A3] mb-1.5">
              DESCRIPTION
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* Styles */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wide text-[#A3A3A3] mb-2">
              STYLES
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.styleTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-[#F97316]/40 bg-[#F97316]/10 text-[#F97316] text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Colors / Mood */}
          {(template.colorPalette?.length > 0 || template.colorMood) && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold tracking-wide text-[#A3A3A3] mb-2">
                COLORS / MOOD
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {template.colorPalette?.map((color, i) => (
                  <span
                    key={`${color}-${i}`}
                    title={color}
                    className="w-7 h-7 rounded-full border border-[#E5E4E0]"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {template.colorMood && (
                  <span className="text-sm font-medium text-[#1A1A1A] px-2">
                    {template.colorMood}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/generate?promptPreset=${encodeURIComponent(template.promptPreset || "")}&packagingType=${template.packagingType.toLowerCase().replace(/_/g, "-")}`}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all duration-300 ease-out shadow-sm hover:shadow-md"
          >
            Use This Template
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
