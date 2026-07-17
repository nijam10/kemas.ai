"use client";

import { useState, useMemo, useEffect } from "react";
import AuthNavbar from "@/components/layout/auth-navbar";
import TemplateCard from "@/components/gallery/template-card";
import TemplateDetailModal from "@/components/gallery/template-detail-modal";
import PackagingTypeFilter, {
  packagingTypeLabel,
} from "@/components/gallery/packaging-type-filter";
import GalleryPagination from "@/components/gallery/gallery-pagination";
import { type PackagingTemplate } from "@/lib/gallery-templates";
import { type GalleryTemplate } from "@prisma/client";
import { useFavorites } from "@/lib/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Package,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const PAGE_SIZE = 16;

type SortBy = "popular" | "newest" | "most-used";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "most-used", label: "Most Used" },
];

export default function GalleryPage() {
  const { toast, toasts } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackagingType, setSelectedPackagingType] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PackagingTemplate | null>(null);
  const [galleryTemplates, setGalleryTemplates] = useState<any[]>([]);

  // Fetch real gallery data
  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Map GalleryTemplate to PackagingTemplate format for the UI components
          const mapped = data.data.templates.map((t: GalleryTemplate) => ({
            id: t.id,
            name: t.title,
            category: t.category,
            packagingType: t.packagingType,
            thumbnailUrl: t.previewImageUrl,
            fullImageUrl: t.previewImageUrl,
            gradientFrom: t.gradientFrom,
            gradientTo: t.gradientTo,
            promptPreset: t.promptPreset,
            styleTags: t.styleTags || [],
            colorMood: t.colorMood,
            badge: t.isFeatured ? "featured" : undefined,
            usageCount: 0, // Fallback, not in schema
            createdAt: t.createdAt,
            author: { name: "Community" } // Could extract from description or add author relation later
          }));
          setGalleryTemplates(mapped);
        }
      });
  }, []);

  // ── Filter → sort → paginate ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return galleryTemplates.filter((t) => {
      const normalizedType = t.packagingType.toLowerCase().replace(/_/g, "-");
      const matchesType =
        selectedPackagingType === "all" ||
        normalizedType === selectedPackagingType;
      const matchesSearch =
        q === "" ||
        t.name.toLowerCase().includes(q) ||
        packagingTypeLabel(t.packagingType).toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [searchQuery, selectedPackagingType, galleryTemplates]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "most-used":
        list.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "popular":
      default:
        list.sort((a, b) => {
          const aPop = a.badge === "popular" ? 1 : 0;
          const bPop = b.badge === "popular" ? 1 : 0;
          if (bPop !== aPop) return bPop - aPop;
          return b.usageCount - a.usageCount;
        });
        break;
    }
    return list;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSlice = useMemo(
    () =>
      sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sorted, currentPage]
  );

  // Reset to page 1 whenever the result set changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPackagingType, sortBy]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Most Popular";

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">
              Packaging Style Gallery
            </h1>
          </div>
          <p className="text-[#737373] max-w-3xl">
            Explore curated snack packaging aesthetics crafted for Indonesian
            UMKM brands.
          </p>
          <p className="text-sm text-[#A3A3A3] max-w-2xl mt-1">
            Reuse proven visual directions and customize them with your own
            product and logo.
          </p>
        </div>

        {/* Search + Filters row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Search templates by name, style, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E4E0] rounded-full text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all duration-300 ease-out"
            />
          </div>
          <button
            type="button"
            onClick={() => toast("Coming soon", "info")}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#E5E4E0] rounded-full text-sm font-medium text-[#737373] hover:border-[#F97316]/70 hover:text-[#1A1A1A] transition-all duration-300 ease-out"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Packaging Type filter */}
        <div className="mb-6">
          <PackagingTypeFilter
            selected={selectedPackagingType}
            onSelect={setSelectedPackagingType}
          />
        </div>

        {/* Sort + count bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E4E0]">
          <p className="text-sm text-[#737373]">
            Showing{" "}
            <span className="font-semibold text-[#1A1A1A]">
              {sorted.length}
            </span>{" "}
            templates
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#737373]">Sort by</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortMenuOpen((o) => !o)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E4E0] rounded-lg text-sm font-medium text-[#1A1A1A] hover:border-[#F97316]/70 transition-all duration-300 ease-out"
              >
                {activeSortLabel}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[#737373] transition-transform duration-300 ease-out",
                    sortMenuOpen && "rotate-180"
                  )}
                />
              </button>
              {sortMenuOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 z-20 bg-white border border-[#E5E4E0] rounded-lg shadow-md overflow-hidden">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setSortMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-all duration-300 ease-out",
                          sortBy === option.value
                            ? "bg-[#F97316]/10 text-[#F97316] font-semibold"
                            : "text-[#737373] hover:bg-[#FCFBF7] hover:text-[#1A1A1A]"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Template grid / empty state */}
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-[#A3A3A3]" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
              No templates found
            </h3>
            <p className="text-sm text-[#737373]">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-8">
            {pageSlice.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={isFavorite(template.id)}
                onToggleFavorite={toggleFavorite}
                onOpen={setSelectedTemplate}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mb-12">
          <GalleryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Template detail modal */}
      <TemplateDetailModal
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />

      {/* Toast container (in-memory, from useToast) */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-lg shadow-md"
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
