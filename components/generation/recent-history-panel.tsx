"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Package, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useDesigns } from "@/hooks/use-designs";

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_CONFIG = {
  COMPLETED: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Done",
  },
  PROCESSING: {
    icon: Loader2,
    color: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    label: "Processing",
    spin: true,
  },
  FAILED: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-100",
    label: "Failed",
  },
  FLAGGED: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    label: "Flagged",
  },
} as const;

export default function RecentHistoryPanel() {
  const router = useRouter();
  const { data, loading } = useDesigns();

  // Show latest 3 designs
  const recent = (data?.designs ?? []).slice(0, 3);

  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F97316]" />
          <h3 className="text-lg font-bold text-[#1A1A1A]">Recent History</h3>
        </div>
        <Link
          href="/history"
          className="text-xs font-medium text-[#F97316] hover:text-[#F97316]/80 transition-colors"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[#FCFBF7] rounded-xl animate-pulse"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F5F5F0] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#F5F5F0] rounded w-3/4" />
                <div className="h-2 bg-[#F5F5F0] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-10 h-10 mx-auto mb-2 text-[#A3A3A3]" />
          <p className="text-sm text-[#737373]">No recent history yet</p>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Start generating to see your history
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((design) => {
            const statusKey = design.status as keyof typeof STATUS_CONFIG;
            const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.PROCESSING;
            const Icon = cfg.icon;

            return (
              <button
                key={design.id}
                onClick={() => router.push(`/preview/${design.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-[#FCFBF7] hover:bg-[#F5F5F0] rounded-xl transition-colors text-left"
              >
                {/* Thumbnail or icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    className={`w-5 h-5 ${cfg.color} ${"spin" in cfg && cfg.spin ? "animate-spin" : ""}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                    {design.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-[#A3A3A3]">
                      {getRelativeTime(design.createdAt)}
                    </span>
                    <span className="text-[#E5E4E0]">·</span>
                    <span className={`text-xs font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
