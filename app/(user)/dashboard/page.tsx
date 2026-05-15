"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import AuthNavbar from "@/components/layout/auth-navbar";
import {
  Package,
  Sparkles,
  Download,
  Eye,
  TrendingUp,
  RotateCw,
  Box,
  ArrowRight,
  Plus,
  History,
  Grid3x3,
  Zap,
} from "lucide-react";
import { useDesigns } from "@/hooks/use-designs";
import { useCredits } from "@/hooks/use-credits";

// ── Static quick actions (no mock data) ──────────────────────────────────────
const quickActions = [
  { title: "Start New Packaging", description: "Generate fresh design", icon: Plus, gradient: "from-[#F97316] to-[#FACC15]", href: "/generate" },
  { title: "Continue Last Design", description: "Resume your work", icon: RotateCw, gradient: "from-[#FACC15] to-[#F97316]", href: "/generate" },
  { title: "Open History", description: "View all designs", icon: History, gradient: "from-[#F97316] to-[#FACC15]", href: "/history" },
  { title: "Browse Templates", description: "Explore gallery", icon: Grid3x3, gradient: "from-[#FACC15] to-[#F97316]", href: "/gallery" },
];

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-[#F5F5F0] mb-4" />
      <div className="h-8 w-16 bg-[#F5F5F0] rounded mb-2" />
      <div className="h-4 w-24 bg-[#F5F5F0] rounded" />
    </div>
  );
}

function DesignCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#F5F5F0]" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#F5F5F0] rounded w-3/4" />
        <div className="h-3 bg-[#F5F5F0] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: designsData, loading: designsLoading } = useDesigns();
  const { data: creditsData, loading: creditsLoading } = useCredits();

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const balance = creditsData?.balance ?? 0;
  const dailyQuota = creditsData?.dailyQuota ?? 40;
  const totalDesigns = designsData?.total ?? 0;
  const recentDesigns = (designsData?.designs ?? []).slice(0, 6);

  // Derive packaging type distribution from real designs
  const packagingTypeCounts = recentDesigns.reduce((acc, d) => {
    const label = d.packagingType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const packagingTypes = Object.entries(packagingTypeCounts)
    .map(([type, count]) => ({ type, count, percentage: Math.round((count / Math.max(totalDesigns, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const stats = [
    { label: "Total Designs", value: designsLoading ? "—" : totalDesigns.toString(), icon: Package, color: "from-[#F97316] to-[#FACC15]" },
    { label: "Credits Remaining", value: creditsLoading ? "—" : balance.toString(), icon: Sparkles, color: "from-[#FACC15] to-[#F97316]" },
    { label: "Credits Used Today", value: creditsLoading ? "—" : (dailyQuota - balance).toString(), icon: Download, color: "from-[#F97316] to-[#FACC15]" },
    { label: "Active Generations", value: "0", icon: Eye, color: "from-[#FACC15] to-[#F97316]" },
  ];

  const handleView = (id: string) => router.push(`/preview/${id}`);
  const handlePreview3D = (id: string) => router.push(`/preview/${id}`);
  const handleDownload = (name: string) => alert(`Downloading ${name}…`);
  const handleReusePrompt = (id: string) => router.push(`/generate?design=${id}`);

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-[#737373]">Continue building premium packaging experiences for your brand.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push("/generate")} className="px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                <Plus className="w-5 h-5" /> Generate New Design
              </button>
              <button onClick={() => router.push("/gallery")} className="px-6 py-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-semibold transition-all flex items-center gap-2">
                Explore Gallery
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(designsLoading || creditsLoading)
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }} className="bg-white border border-[#E5E4E0] rounded-2xl p-6 hover:shadow-lg hover:border-[#F97316]/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#1A1A1A] mb-1">{stat.value}</p>
                <p className="text-sm text-[#737373]">{stat.label}</p>
              </motion.div>
            ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }} onClick={() => router.push(action.href)} className="group relative bg-white border border-[#E5E4E0] rounded-2xl p-6 hover:shadow-lg hover:border-[#F97316]/20 transition-all text-left overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{action.title}</h3>
                  <p className="text-sm text-[#737373]">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Designs */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1A1A1A]">Recent Designs</h2>
                <button onClick={() => router.push("/history")} className="text-sm font-medium text-[#F97316] hover:text-[#F97316]/80 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {designsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <DesignCardSkeleton key={i} />)}
                </div>
              ) : recentDesigns.length === 0 ? (
                <div className="bg-white border border-[#E5E4E0] rounded-2xl p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-[#A3A3A3]" />
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No designs yet</h3>
                  <p className="text-sm text-[#737373] mb-6">Generate your first packaging design to see it here.</p>
                  <button onClick={() => router.push("/generate")} className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#F97316]/90 transition-all">
                    Start Generating
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recentDesigns.map((design, index) => {
                    const typeLabel = design.packagingType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                    const dateLabel = new Date(design.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    return (
                      <motion.div key={design.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }} className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#F97316]/20 transition-all group">
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FCFBF7] to-[#F5F5F0] flex items-center justify-center overflow-hidden">
                          <div className="w-24 h-32 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl shadow-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <Package className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 bg-[#FACC15]/95 backdrop-blur-sm border border-[#FACC15]/20 rounded-full text-xs font-semibold text-[#1A1A1A]">
                              {design.status === "COMPLETED" ? "Completed" : design.status}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                            <button onClick={() => handleView(design.id)} className="p-2.5 bg-white hover:bg-[#F5F5F0] rounded-lg transition-colors" title="View"><Eye className="w-4 h-4 text-[#1A1A1A]" /></button>
                            <button onClick={() => handlePreview3D(design.id)} className="p-2.5 bg-white hover:bg-[#F5F5F0] rounded-lg transition-colors" title="3D Preview"><Box className="w-4 h-4 text-[#1A1A1A]" /></button>
                            <button onClick={() => handleDownload(design.title)} className="p-2.5 bg-white hover:bg-[#F5F5F0] rounded-lg transition-colors" title="Download"><Download className="w-4 h-4 text-[#1A1A1A]" /></button>
                            <button onClick={() => handleReusePrompt(design.id)} className="p-2.5 bg-white hover:bg-[#F5F5F0] rounded-lg transition-colors" title="Reuse Prompt"><RotateCw className="w-4 h-4 text-[#1A1A1A]" /></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-[#1A1A1A] mb-1 line-clamp-1">{design.title}</h3>
                          <div className="flex items-center justify-between text-xs text-[#737373]">
                            <span>{typeLabel}</span>
                            <span>{dateLabel}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Credit Usage */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Credit Usage</h3>
              {creditsLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-[#F5F5F0] rounded w-full" />
                  <div className="h-2 bg-[#F5F5F0] rounded w-full" />
                  <div className="h-4 bg-[#F5F5F0] rounded w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#737373]">Today</span>
                      <span className="text-sm font-bold text-[#1A1A1A]">{dailyQuota - balance} / {dailyQuota}</span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] rounded-full transition-all" style={{ width: `${Math.min(100, ((dailyQuota - balance) / dailyQuota) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#E5E4E0]">
                    <p className="text-xs text-[#737373] mb-2">{balance} credits remaining</p>
                    <button className="w-full px-4 py-2 bg-[#F5F5F0] hover:bg-[#E5E4E0] text-[#1A1A1A] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> Get More Credits
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Favorite Packaging Types */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Favorite Types</h3>
              {designsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-[#F5F5F0] rounded" />)}
                </div>
              ) : packagingTypes.length === 0 ? (
                <p className="text-sm text-[#737373]">Generate designs to see your favorite types.</p>
              ) : (
                <div className="space-y-3">
                  {packagingTypes.map((type, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[#1A1A1A]">{type.type}</span>
                        <span className="text-xs text-[#737373]">{type.count} designs</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F5F5F0] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] rounded-full" style={{ width: `${type.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Workspace Insights */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Workspace Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#FACC15]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Most Generated</p>
                    <p className="text-xs text-[#737373]">{packagingTypes[0]?.type ?? "No data yet"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <RotateCw className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Total Designs</p>
                    <p className="text-xs text-[#737373]">{totalDesigns} packaging designs created</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-[#FACC15]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Credits Used</p>
                    <p className="text-xs text-[#737373]">{dailyQuota - balance} of {dailyQuota} today</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
