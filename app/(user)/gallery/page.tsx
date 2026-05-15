"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthNavbar from "@/components/layout/auth-navbar";
import { Package, Search, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGallery } from "@/hooks/use-gallery";
import type { ApiGalleryTemplate } from "@/lib/api-client";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCategory(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatPackagingLabel(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#F5F5F0]" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-[#F5F5F0] rounded w-1/2" />
        <div className="h-4 bg-[#F5F5F0] rounded w-3/4" />
        <div className="h-3 bg-[#F5F5F0] rounded w-full" />
        <div className="h-9 bg-[#F5F5F0] rounded-lg mt-4" />
      </div>
    </div>
  );
}

const categories = [
  "All",
  "Food Beverages",
  "Artisan Snack",
  "Modern Minimal",
  "Traditional",
  "Organic",
  "Premium Coffee",
  "Healthy Products",
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ApiGalleryTemplate | null>(null);
  const router = useRouter();

  // ── Fetch from API ────────────────────────────────────────────────────────
  const { data, loading, error } = useGallery();
  const templates: ApiGalleryTemplate[] = data?.templates ?? [];

  // ── Derived display list ──────────────────────────────────────────────────
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const cat = formatCategory(t.category);
      const matchesCategory = selectedCategory === "All" || cat === selectedCategory;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const featuredTemplate = templates.find((t) => t.isFeatured);
  const regularTemplates = filteredTemplates.filter((t) => !t.isFeatured);

  const handleUseTemplate = (template: ApiGalleryTemplate) => {
    router.push(`/generate?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#1A1A1A]">
              Packaging Style Gallery
            </h1>
          </div>
          <p className="text-lg text-[#737373] max-w-3xl mb-3">
            Explore curated packaging aesthetics crafted for Indonesian UMKM brands.
          </p>
          <p className="text-sm text-[#A3A3A3] max-w-2xl">
            Reuse proven visual directions and customize them with your own product and logo.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E4E0] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "bg-white border border-[#E5E4E0] text-[#737373] hover:border-[#F97316]/40 hover:text-[#1A1A1A]"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Template */}
        {!loading && featuredTemplate && selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#F97316]/40 transition-all duration-300 group">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                      <Package className="w-24 h-24 text-white opacity-50" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#F97316] text-white text-xs font-semibold rounded-full">
                    Featured
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full text-xs font-semibold text-[#F97316]">
                      {formatCategory(featuredTemplate.category)}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
                    {featuredTemplate.title}
                  </h2>
                  <p className="text-base text-[#737373] mb-4 leading-relaxed">
                    {featuredTemplate.description ?? featuredTemplate.promptPreset}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#A3A3A3]">Packaging Type:</span>
                      <span className="font-medium text-[#1A1A1A]">{formatPackagingLabel(featuredTemplate.packagingType)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#A3A3A3]">Color Mood:</span>
                      <span className="font-medium text-[#1A1A1A]">{featuredTemplate.colorMood ?? "Warm tones"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(featuredTemplate)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    Use This Template
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Template Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {regularTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#F97316]/40 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#F5F5F0] to-[#FCFBF7] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full h-full bg-gradient-to-br from-[#F97316]/20 to-[#FACC15]/20 rounded-xl transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                      <Package className="w-16 h-16 text-[#F97316]/40" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded text-xs font-semibold text-[#F97316]">
                      {formatCategory(template.category)}
                    </span>
                    <span className="text-xs text-[#A3A3A3]">
                      {formatPackagingLabel(template.packagingType)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-[#737373] mb-4 line-clamp-2">
                    {template.description ?? template.promptPreset.substring(0, 80)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                    className="w-full px-4 py-2 bg-white border border-[#E5E4E0] hover:bg-[#F97316] hover:border-[#F97316] hover:text-white text-[#1A1A1A] rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Use Template
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-[#A3A3A3]" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              No templates found
            </h3>
            <p className="text-sm text-[#737373]">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl p-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to create your own packaging?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Start with a template or create from scratch
            </p>
            <button
              onClick={() => router.push("/generate")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#F97316] rounded-xl font-bold hover:shadow-xl transition-all duration-200"
            >
              Start Generating
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
            onClick={() => setSelectedTemplate(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full text-xs font-semibold text-[#F97316]">
                    {formatCategory(selectedTemplate.category)}
                  </span>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mt-3 mb-2">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-sm text-[#A3A3A3]">
                    {formatPackagingLabel(selectedTemplate.packagingType)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="w-8 h-8 rounded-lg hover:bg-[#E5E4E0] flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#F5F5F0] to-[#FCFBF7] rounded-xl flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-xl shadow-2xl flex items-center justify-center">
                    <Package className="w-20 h-20 text-white opacity-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                      Style Description
                    </h4>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      {selectedTemplate.description ?? selectedTemplate.promptPreset}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                      Color Mood
                    </h4>
                    <p className="text-sm text-[#737373]">
                      {selectedTemplate.colorMood ?? "Warm tones"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                      Packaging Type
                    </h4>
                    <p className="text-sm text-[#737373]">
                      {formatPackagingLabel(selectedTemplate.packagingType)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E4E0]">
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Use This Template
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-center text-[#737373] mt-3">
                  This will redirect you to Generate page with pre-filled settings
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
