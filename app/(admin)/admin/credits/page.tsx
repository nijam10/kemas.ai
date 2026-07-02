"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminShell from "@/components/admin/admin-shell";
import { CreditCard, Search, Users } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminCreditUser {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  credits: number;
  dailyQuota: number;
  totalUsed: number;
  lastTopUp: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminCreditsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminCreditUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/credits")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUsers(data.data.users);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.businessName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCreditsDistributed = users.reduce((sum, u) => sum + u.credits, 0);
  const totalCreditsUsed = users.reduce((sum, u) => sum + u.totalUsed, 0);
  const averageCreditsPerUser = users.length > 0 ? Math.round(totalCreditsDistributed / users.length) : 0;

  return (
    <AdminShell title="Credit Management" subtitle="Manage user credit balances and top-up history.">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Credits Distributed", value: totalCreditsDistributed, icon: CreditCard },
            { label: "Total Credits Used", value: totalCreditsUsed, icon: CreditCard },
            { label: "Avg Credits / User", value: averageCreditsPerUser, icon: Users },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-[#E5E4E0] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#F97316]" />
                </div>
                <p className="text-sm text-[#737373]">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-[#E5E4E0] rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input type="text" placeholder="Search users…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-[#E5E4E0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FCFBF7] border-b border-[#E5E4E0]">
                <tr>
                  {["User", "Business", "Balance", "Daily Quota", "Total Used", "Last Top-Up", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#737373] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E0]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-[#A3A3A3]" />
                      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No credit data yet</p>
                      <p className="text-xs text-[#737373]">Credit data will appear here once the admin API is connected.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FCFBF7] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">{user.name.charAt(0)}</div>
                          <div><p className="text-sm font-semibold text-[#1A1A1A]">{user.name}</p><p className="text-xs text-[#737373]">{user.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm text-[#1A1A1A]">{user.businessName ?? "—"}</p></td>
                      <td className="px-6 py-4"><p className="text-sm font-bold text-[#F97316]">{user.credits}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-[#1A1A1A]">{user.dailyQuota}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-[#1A1A1A]">{user.totalUsed}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-[#737373]">{user.lastTopUp}</p></td>
                      <td className="px-6 py-4">
                        <button onClick={() => alert("Top-up API not yet implemented")} className="px-3 py-1.5 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] rounded-lg text-xs font-semibold transition-colors">Top Up</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminShell>
  );
}
