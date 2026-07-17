"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminShell from "@/components/admin/admin-shell";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Flag,
  Trash2,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModerationStatus = "PENDING" | "APPROVED" | "FLAGGED" | "REMOVED";

interface ModerationItem {
  id: string;
  userName: string;
  userBusiness: string;
  type: "PROMPT" | "IMAGE";
  status: ModerationStatus;
  content: string;
  imageUrl?: string | null;
  timestamp: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminModerationPage() {
  const [prompts, setPrompts] = useState<ModerationItem[]>([]);
  const [generations, setGenerations] = useState<ModerationItem[]>([]);
  const [activeTab, setActiveTab] = useState<"prompts" | "images">("prompts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/moderation")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const logs = data.data.logs;
          const mappedPrompts = logs
            .filter((l: any) => l.type === "PROMPT")
            .map((l: any) => ({
              id: l.id,
              userName: l.userName,
              userBusiness: "",
              type: l.type,
              status: l.status,
              content: l.reason || "No content available",
              timestamp: new Date(l.createdAt).toLocaleDateString()
            }));
          const mappedImages = logs
            .filter((l: any) => l.type === "IMAGE")
            .map((l: any) => ({
              id: l.id,
              userName: l.userName,
              userBusiness: "",
              type: l.type,
              status: l.status,
              content: l.reason || "No reason",
              imageUrl: l.designImageUrl,
              timestamp: new Date(l.createdAt).toLocaleDateString()
            }));
          setPrompts(mappedPrompts);
          setGenerations(mappedImages);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingPrompts = prompts.filter((p) => p.status === "PENDING").length;
  const pendingImages = generations.filter((g) => g.status === "PENDING").length;
  const flaggedItems = [...prompts, ...generations].filter((item) => item.status === "FLAGGED").length;

  const handleApprovePrompt = (id: string) => setPrompts(prompts.map((p) => p.id === id ? { ...p, status: "APPROVED" as ModerationStatus } : p));
  const handleFlagPrompt = (id: string) => setPrompts(prompts.map((p) => p.id === id ? { ...p, status: "FLAGGED" as ModerationStatus } : p));
  const handleRemovePrompt = (id: string) => setPrompts(prompts.filter((p) => p.id !== id));
  const handleApproveImage = (id: string) => setGenerations(generations.map((g) => g.id === id ? { ...g, status: "APPROVED" as ModerationStatus } : g));
  const handleFlagImage = (id: string) => setGenerations(generations.map((g) => g.id === id ? { ...g, status: "FLAGGED" as ModerationStatus } : g));
  const handleRemoveImage = (id: string) => setGenerations(generations.filter((g) => g.id !== id));

  return (
    <AdminShell title="Content Moderation" subtitle="Review and moderate user prompts and generated packaging designs.">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Pending Prompts", value: pendingPrompts, icon: Clock, color: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
            { label: "Pending Images", value: pendingImages, icon: ImageIcon, color: "bg-blue-100", iconColor: "text-blue-600" },
            { label: "Flagged Items", value: flaggedItems, icon: AlertTriangle, color: "bg-red-100", iconColor: "text-red-600" },
            { label: "Approved Today", value: 0, icon: CheckCircle2, color: "bg-green-100", iconColor: "text-green-600" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-[#E5E4E0] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <p className="text-sm text-[#737373]">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-[#E5E4E0] rounded-xl p-1 inline-flex">
          <button onClick={() => setActiveTab("prompts")} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "prompts" ? "bg-[#F97316] text-white" : "text-[#737373] hover:text-[#1A1A1A]"}`}>
            Prompts ({pendingPrompts})
          </button>
          <button onClick={() => setActiveTab("images")} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "images" ? "bg-[#F97316] text-white" : "text-[#737373] hover:text-[#1A1A1A]"}`}>
            Generated Images ({pendingImages})
          </button>
        </motion.div>

        {/* Prompts Queue */}
        {activeTab === "prompts" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
            {prompts.length === 0 ? (
              <div className="bg-white border border-[#E5E4E0] rounded-xl p-12 text-center">
                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-[#A3A3A3]" />
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No prompts to review</p>
                <p className="text-xs text-[#737373]">Moderation queue will appear here once the admin API is connected.</p>
              </div>
            ) : (
              prompts.map((prompt) => (
                <div key={prompt.id} className={`bg-white border rounded-xl p-6 ${prompt.status === "FLAGGED" ? "border-red-300 bg-red-50/50" : "border-[#E5E4E0]"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">{prompt.userName.charAt(0)}</div>
                        <div><p className="text-sm font-semibold text-[#1A1A1A]">{prompt.userName}</p><p className="text-xs text-[#737373]">{prompt.userBusiness}</p></div>
                        <span className="text-xs text-[#737373]">• {prompt.timestamp}</span>
                        {prompt.status === "FLAGGED" && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Flagged</span>}
                      </div>
                      <div className="bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg p-4">
                        <p className="text-sm text-[#1A1A1A] leading-relaxed">{prompt.content}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleApprovePrompt(prompt.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"><CheckCircle2 className="w-4 h-4" />Approve</button>
                      <button onClick={() => handleFlagPrompt(prompt.id)} className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] text-[#1A1A1A] text-sm font-semibold rounded-lg hover:bg-[#F59E0B] transition-colors"><Flag className="w-4 h-4" />Flag</button>
                      <button onClick={() => handleRemovePrompt(prompt.id)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"><Trash2 className="w-4 h-4" />Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Images Queue */}
        {activeTab === "images" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {generations.length === 0 ? (
              <div className="bg-white border border-[#E5E4E0] rounded-xl p-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-[#A3A3A3]" />
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No images to review</p>
                <p className="text-xs text-[#737373]">Generated image moderation will appear here once the admin API is connected.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {generations.map((gen) => (
                  <div key={gen.id} className={`bg-white border rounded-xl overflow-hidden ${gen.status === "FLAGGED" ? "border-red-300 bg-red-50/50" : "border-[#E5E4E0]"}`}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center">
                      <div className="text-center"><ImageIcon className="w-16 h-16 text-[#737373] mx-auto mb-2" /><p className="text-sm text-[#737373]">Generated Packaging Preview</p></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">{gen.userName.charAt(0)}</div>
                        <div><p className="text-sm font-semibold text-[#1A1A1A]">{gen.userName}</p><p className="text-xs text-[#737373]">{gen.userBusiness}</p></div>
                        {gen.status === "FLAGGED" && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Flagged</span>}
                      </div>
                      <div className="bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg p-3 mb-4">
                        <p className="text-xs text-[#737373] mb-1">Prompt:</p>
                        <p className="text-sm text-[#1A1A1A]">{gen.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveImage(gen.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"><CheckCircle2 className="w-4 h-4" />Approve</button>
                        <button onClick={() => handleFlagImage(gen.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FACC15] text-[#1A1A1A] text-sm font-semibold rounded-lg hover:bg-[#F59E0B] transition-colors"><Flag className="w-4 h-4" /></button>
                        <button onClick={() => handleRemoveImage(gen.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"><Trash2 className="w-4 h-4" /> Hapus Permanen</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AdminShell>
  );
}
