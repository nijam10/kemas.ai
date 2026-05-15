"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthNavbar from "@/components/layout/auth-navbar";
import {
  Package,
  Download,
  Eye,
  Calendar,
  Search,
  RotateCw,
  Box,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useDesigns } from "@/hooks/use-designs";
import type { ApiDesign } from "@/lib/api-client";

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDisplayItem(d: ApiDesign) {
  const packagingLabel = d.packagingType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    id: d.id,
    name: d.title,
    type: packagingLabel,
    date: new Date(d.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timestamp: d.createdAt,
    prompt: d.prompt.length > 80 ? d.prompt.substring(0, 80) + "…" : d.prompt,
    fullPrompt: d.prompt,
    credits: d.creditsUsed,
    downloads: 1, // placeholder until download tracking is implemented
  };
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#F5F5F0]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#F5F5F0] rounded w-3/4" />
        <div className="h-3 bg-[#F5F5F0] rounded w-1/2" />
        <div className="h-3 bg-[#F5F5F0] rounded w-full" />
        <div className="h-9 bg-[#F5F5F0] rounded-lg mt-4" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-[#F5F5F0] rounded-lg" />
          <div className="h-8 bg-[#F5F5F0] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const packagingTypes = [
  { value: "all", label: "All Types" },
  { value: "standing-pouch", label: "Standing Pouch" },
  { value: "box", label: "Box" },
  { value: "jar", label: "Jar" },
  { value: "bottle", label: "Bottle" },
  { value: "sachet", label: "Sachet" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-downloaded", label: "Most Downloaded" },
];

export default function HistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ── Fetch from API ────────────────────────────────────────────────────────
  const { data, loading } = useDesigns();
  const history = useMemo(() => {
    return (data?.designs ?? []).map(toDisplayItem);
  }, [data]);

  const totalDesigns = data?.total ?? history.length;
  const totalDownloads = history.reduce((sum, item) => sum + item.downloads, 0);

  const handleView = (id: string) => {
    router.push(`/preview/${id}`);
  };

  const handlePreview3D = (id: string) => {
    router.push(`/preview/${id}`);
  };

  const handleDownload = (name: string) => {
    alert(`Downloading ${name}...`);
  };

  const handleReusePrompt = (prompt: string) => {
    router.push(`/generate?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                Your Packaging History
              </h1>
              <p className="text-[#737373]">
                All generated packaging designs stored in one workspace.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-5 py-3 bg-white border border-[#E5E4E0] rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Total Designs</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{totalDesigns}</p>
              </div>
              <div className="px-5 py-3 bg-white border border-[#E5E4E0] rounded-xl">
                <p className="text-xs text-[#A3A3A3] mb-1">Downloads</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{totalDownloads}</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[280px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E4E0] rounded-xl text-sm focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-white border border-[#E5E4E0] rounded-xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer"
            >
              {packagingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-[#E5E4E0] rounded-xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* History Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package className="w-16 h-16 text-[#A3A3A3] mb-4" />
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No designs yet</h3>
                <p className="text-sm text-[#737373] mb-6">
                  Generate your first packaging design to see it here.
                </p>
                <button
                  onClick={() => router.push("/generate")}
                  className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#F97316]/90 transition-all"
                >
                  Start Generating
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#F97316]/20 transition-all group"
                >
                  {/* Preview Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FCFBF7] to-[#F5F5F0] flex items-center justify-center overflow-hidden">
                    <div className="relative">
                      <div className="w-32 h-40 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl shadow-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        <Package className="w-16 h-16 text-white" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-[#E5E4E0] rounded-full text-xs font-semibold text-[#1A1A1A]">
                        {item.type}
                      </span>
                      <span className="px-2.5 py-1 bg-[#FACC15]/95 backdrop-blur-sm border border-[#FACC15]/20 rounded-full text-xs font-semibold text-[#1A1A1A]">
                        Export Ready
                      </span>
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => handleView(item.id)}
                        className="p-3 bg-white hover:bg-[#F5F5F0] rounded-xl transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-[#1A1A1A]" />
                      </button>
                      <button
                        onClick={() => handlePreview3D(item.id)}
                        className="p-3 bg-white hover:bg-[#F5F5F0] rounded-xl transition-colors"
                        title="3D Preview"
                      >
                        <Box className="w-5 h-5 text-[#1A1A1A]" />
                      </button>
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="p-3 bg-white hover:bg-[#F5F5F0] rounded-xl transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5 text-[#1A1A1A]" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.credits} credits</span>
                      <span>•</span>
                      <span>{item.downloads} downloads</span>
                    </div>
                    <p className="text-sm text-[#737373] line-clamp-2 mb-4">
                      {item.prompt}
                    </p>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleReusePrompt(item.fullPrompt)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl text-sm font-semibold transition-all"
                      >
                        <RotateCw className="w-4 h-4" />
                        Reuse Prompt
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handlePreview3D(item.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/20 text-[#1A1A1A] rounded-xl text-sm font-medium transition-all"
                        >
                          <Box className="w-4 h-4" />
                          3D
                        </button>
                        <button
                          onClick={() => handleDownload(item.name)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/20 text-[#1A1A1A] rounded-xl text-sm font-medium transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Recent Downloads */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  Recent Downloads
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                      {history[0]?.name}
                    </p>
                    <p className="text-xs text-[#A3A3A3]">{getRelativeTime(history[0]?.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                      {history[1]?.name}
                    </p>
                    <p className="text-xs text-[#A3A3A3]">{getRelativeTime(history[1]?.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Generated */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  Last Generated
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {history[0]?.name}
                </p>
                <p className="text-xs text-[#737373]">
                  {history[0]?.type} • {history[0]?.date}
                </p>
                <button
                  onClick={() => handleView(history[0]?.id)}
                  className="w-full mt-3 px-4 py-2 bg-[#F5F5F0] hover:bg-[#E5E4E0] text-[#1A1A1A] rounded-lg text-sm font-medium transition-all"
                >
                  View Design
                </button>
              </div>
            </div>

            {/* Favorite Type */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#FACC15]" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  Favorite Type
                </h3>
              </div>
              <div className="text-center py-3">
                <p className="text-2xl font-bold text-[#F97316] mb-1">
                  {history[0]?.type ?? "Standing Pouch"}
                </p>
                <p className="text-xs text-[#737373]">
                  Most used type
                </p>
              </div>
            </div>

            {/* Credits Used This Week */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  This Week
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[#737373]">Credits Used</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">{history.reduce((sum, d) => sum + d.credits, 0)}</p>
                  </div>
                  <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[#737373]">Designs Created</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">{totalDesigns}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
