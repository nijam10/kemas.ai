"use client";

import { cn } from "@/lib/utils";

export interface PackagingTypeOption {
  label: string;
  value: string;
}

// "All Types" (default) plus the 6 supported packaging types.
export const PACKAGING_TYPE_OPTIONS: PackagingTypeOption[] = [
  { label: "All Types", value: "all" },
  { label: "Standing Pouch", value: "standing-pouch" },
  { label: "Pillow Pouch", value: "pillow-pouch" },
  { label: "Box", value: "box" },
  { label: "Jar", value: "jar" },
  { label: "Bottle", value: "bottle" },
  { label: "Sachet", value: "sachet" },
];

/** Human-readable label for a packaging type value (reused by cards). */
export function packagingTypeLabel(value: string): string {
  const match = PACKAGING_TYPE_OPTIONS.find((o) => o.value === value);
  if (match) return match.label;
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

interface PackagingTypeFilterProps {
  selected: string;
  onSelect: (value: string) => void;
}

export default function PackagingTypeFilter({
  selected,
  onSelect,
}: PackagingTypeFilterProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold tracking-wide text-[#A3A3A3]">
        PACKAGING TYPE
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {PACKAGING_TYPE_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out",
                isActive
                  ? "bg-[#F97316] text-white shadow-sm"
                  : "bg-white border border-[#E5E4E0] text-[#737373] hover:border-[#F97316]/70 hover:text-[#1A1A1A]"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
