"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export default function RecentHistoryPanel() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F97316]" />
          <h3 className="text-lg font-bold text-[#1A1A1A]">
            Recent History
          </h3>
        </div>

        <Link
          href="/history"
          className="text-xs font-medium text-[#F97316] hover:text-[#F97316]/80 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="text-center py-8">
        <p className="text-sm text-[#737373]">
          No recent history yet
        </p>
        <p className="text-xs text-[#A3A3A3] mt-1">
          Start generating to see your history
        </p>
      </div>
    </div>
  );
}