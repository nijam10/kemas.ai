"use client";

import { cn } from "@/lib/utils";

export type HistoryTab = "generations" | "favorites";

interface HistoryTabsProps {
  active: HistoryTab;
  onChange: (tab: HistoryTab) => void;
  favoritesCount: number;
}

export default function HistoryTabs({
  active,
  onChange,
  favoritesCount,
}: HistoryTabsProps) {
  const tabs: { id: HistoryTab; label: string }[] = [
    { id: "generations", label: "Generations" },
    {
      id: "favorites",
      label:
        favoritesCount > 0 ? `Favorites (${favoritesCount})` : "Favorites",
    },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-[#E5E4E0]">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative -mb-px pb-3 pt-1 text-sm font-semibold transition-all duration-300 ease-out",
              isActive
                ? "text-[#F97316] border-b-2 border-[#F97316]"
                : "text-[#737373] border-b-2 border-transparent hover:text-[#1A1A1A]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
