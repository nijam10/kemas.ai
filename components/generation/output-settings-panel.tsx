"use client";

import { Sliders, Image as ImageIcon, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OutputFormat, Resolution } from "@/lib/credits";

interface OutputSettingsPanelProps {
  format: OutputFormat;
  resolution: Resolution;
  totalCredits: number;
  onFormatChange: (f: OutputFormat) => void;
  onResolutionChange: (r: Resolution) => void;
}

const FORMAT_OPTIONS: {
  id: OutputFormat;
  label: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: "2d", label: "2D mockup", icon: ImageIcon },
  { id: "3d", label: "3D mockup", icon: Box, badge: "+5" },
];

const RESOLUTION_OPTIONS: {
  id: Resolution;
  label: string;
  badge?: string;
}[] = [
  { id: "standard", label: "Standard" },
  { id: "hd", label: "HD", badge: "+3" },
];

// Shared selector styles — active: 2px amber border + 10% amber tint + amber text.
// Default: 1px neutral border + white background, with stronger hover feedback
// (border + tint + soft shadow) matching the packaging type cards. No translate
// lift here — stacked/side-by-side options would collide.
const ACTIVE_CLASSES = "border-2 border-[#F97316] bg-[#F97316]/10 text-[#F97316]";
const DEFAULT_CLASSES =
  "border border-[#E5E4E0] bg-white text-[#1A1A1A] hover:border-[#F97316]/70 hover:bg-[#F97316]/[0.07] hover:shadow-sm";

export default function OutputSettingsPanel({
  format,
  resolution,
  totalCredits,
  onFormatChange,
  onResolutionChange,
}: OutputSettingsPanelProps) {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-4 h-4 text-[#F97316]" />
        <h3 className="text-lg font-bold text-[#1A1A1A]">Output Settings</h3>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        {/* Output Format */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-[#1A1A1A]">
            Output Format
          </span>
          <div className="space-y-2">
            {FORMAT_OPTIONS.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => onFormatChange(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out text-left",
                  format === id ? ACTIVE_CLASSES : DEFAULT_CLASSES
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span
                    className={cn(
                      "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                      format === id
                        ? "bg-[#F97316]/20 text-[#F97316]"
                        : "bg-[#E5E4E0] text-[#737373]"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-[#1A1A1A]">
            Resolution
          </span>
          <div className="grid grid-cols-2 gap-2">
            {RESOLUTION_OPTIONS.map(({ id, label, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => onResolutionChange(id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-out",
                  resolution === id ? ACTIVE_CLASSES : DEFAULT_CLASSES
                )}
              >
                <span>{label}</span>
                {badge && (
                  <span
                    className={cn(
                      "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                      resolution === id
                        ? "bg-[#F97316]/20 text-[#F97316]"
                        : "bg-[#E5E4E0] text-[#737373]"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — Total */}
      <div className="pt-4 mt-5 border-t border-[#E5E4E0] flex items-center justify-between">
        <span className="text-sm text-[#737373]">Total</span>
        <span className="text-[#F97316] font-bold">{totalCredits} credits</span>
      </div>
    </div>
  );
}
