"use client";

import { Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackagingTemplate } from "@/lib/gallery-templates";
import { PACKAGING_ICONS } from "@/components/icons/packaging-icons";

interface TemplateCardProps {
  template: PackagingTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (template: PackagingTemplate) => void;
}

export default function TemplateCard({
  template,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: TemplateCardProps) {
  // Distinct silhouette per packaging type (shared icons).
  const Silhouette = PACKAGING_ICONS[template.packagingType];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(template)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(template);
        }
      }}
      className="group relative bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/40"
    >
      {/* Preview — mood gradient + per-type silhouette */}
      <div
        className="relative aspect-[4/5] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${template.gradientFrom}, ${template.gradientTo})`,
        }}
      >
        {Silhouette && (
          <Silhouette className="h-[58%] w-auto text-white" strokeWidth={2} />
        )}

        {/* Badge (top-left) */}
        {template.badge === "popular" && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white text-[#F97316] text-[10px] font-bold tracking-wide shadow-sm">
            <Zap className="w-3 h-3" fill="currentColor" />
            POPULAR
          </span>
        )}
        {template.badge === "new" && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2 py-1 rounded-full bg-[#F97316] text-white text-[10px] font-bold tracking-wide shadow-sm">
            NEW
          </span>
        )}

        {/* Favorite heart (top-right) — stops propagation so it never opens the modal */}
        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-out hover:bg-white/40"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-300 ease-out",
              isFavorite ? "fill-[#F97316] text-[#F97316]" : "text-white"
            )}
          />
        </button>

        {/* Hover overlay — slides up from the bottom */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <h3 className="text-white font-medium text-[13px] truncate">
            {template.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {template.styleTags.map((tag) => (
              <span
                key={tag}
                className="bg-white/15 backdrop-blur-sm text-white border border-white/20 px-2 py-0.5 rounded-full text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
