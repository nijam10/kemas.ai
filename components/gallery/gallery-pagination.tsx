"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const arrowClasses =
    "w-9 h-9 rounded-lg flex items-center justify-center border border-[#E5E4E0] bg-white text-[#737373] transition-all duration-300 ease-out hover:border-[#F97316]/70 hover:text-[#1A1A1A]";

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(arrowClasses, isFirst && "opacity-40 cursor-not-allowed hover:border-[#E5E4E0] hover:text-[#737373]")}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 ease-out",
              isActive
                ? "bg-[#F97316] text-white shadow-sm"
                : "bg-white border border-[#E5E4E0] text-[#737373] hover:border-[#F97316]/70 hover:text-[#1A1A1A]"
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(arrowClasses, isLast && "opacity-40 cursor-not-allowed hover:border-[#E5E4E0] hover:text-[#737373]")}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
