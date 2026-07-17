"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminShell from "@/components/admin/admin-shell";
import { Users, Search, Eye, Ban, CheckCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  role: string;
  status: UserStatus;
  creditBalance: number;
  totalDesigns: number;
  createdAt: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          // Map backend formatted users to UI AdminUser
          const mappedUsers = data.data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            businessName: u.businessName || null,
            role: u.role,
            status: u.status,
            creditBalance: u.credits,
            totalDesigns: u.designsCount,
            createdAt: u.createdAt
          }));
          setUsers(mappedUsers);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.businessName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSuspend = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "SUSPENDED" } : u));
    alert(`Suspend ${userId} — API not yet implemented`);
  };
  const handleActivate = (userId: string) => alert(`Activate ${userId} — API not yet implemented`);
  const handleView = (userId: string) => alert(`View ${userId} — API not yet implemented`);

  return (
    <AdminShell title="UMKM Users" subtitle="Manage registered UMKM accounts and access status.">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length },
            { label: "Active Users", value: users.filter((u) => u.status === "ACTIVE").length },
            { label: "Suspended", value: users.filter((u) => u.status === "SUSPENDED").length },
            { label: "New This Month", value: 0 },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-[#E5E4E0] rounded-xl p-4">
              <p className="text-sm text-[#737373] mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-[#E5E4E0] rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input type="text" placeholder="Search users, business, or email…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)} className="px-4 py-2 bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg text-sm focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer">
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white border border-[#E5E4E0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FCFBF7] border-b border-[#E5E4E0]">
                <tr>
                  {["User", "Business", "Credits", "Designs", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#737373] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E0]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 mx-auto mb-3 text-[#A3A3A3]" />
                      <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No users yet</p>
                      <p className="text-xs text-[#737373]">User data will appear here once the admin API is connected.</p>
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
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-[#1A1A1A]">{user.creditBalance}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-[#1A1A1A]">{user.totalDesigns}</p></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm text-[#737373]">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleView(user.id)} className="p-2 hover:bg-[#F5F5F0] rounded-lg transition-colors" title="View"><Eye className="w-4 h-4 text-[#737373]" /></button>
                          {user.status === "ACTIVE"
                            ? <button onClick={() => handleSuspend(user.id)} className="flex items-center gap-1.5 p-2 hover:bg-red-50 rounded-lg text-red-600 text-sm font-medium" title="Suspend"><Ban className="w-4 h-4" /> Suspend Akun</button>
                            : <button onClick={() => handleActivate(user.id)} className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Activate"><CheckCircle2 className="w-4 h-4 text-green-600" /></button>}
                        </div>
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
