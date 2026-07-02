"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import AdminShell from "@/components/admin/admin-shell";
import {
  Users,
  Zap,
  Server,
  Ban,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react";

// ── Stat icons ────────────────────────────────


export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatsData(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total UMKM Users", icon: Users, color: "from-[#F97316] to-[#FACC15]", value: loading ? "—" : statsData?.totalUsers ?? 0 },
    { label: "Active Generations Today", icon: Zap, color: "from-[#FACC15] to-[#F97316]", value: loading ? "—" : statsData?.activeUsers ?? 0 },
    { label: "RunPod Requests", icon: Server, color: "from-[#F97316] to-[#FACC15]", value: loading ? "—" : statsData?.queueCount ?? 0 },
    { label: "Suspended Accounts", icon: Ban, color: "from-red-500 to-red-600", value: loading ? "—" : 0 },
    { label: "Credits Distributed", icon: CreditCard, color: "from-[#FACC15] to-[#F97316]", value: loading ? "—" : statsData?.creditsDistributed ?? 0 },
    { label: "System Status", icon: CheckCircle2, color: "from-green-500 to-green-600", value: loading ? "—" : statsData?.serverStatus ?? "Unknown" },
  ];

  return (
    <AdminShell title="Admin Overview" subtitle="Monitor platform activity, usage, and system health.">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border border-[#E5E4E0] rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-1">{stat.value}</p>
              <p className="text-xs text-[#737373]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-white border border-[#E5E4E0] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Usage Trend</h3>
              <TrendingUp className="w-5 h-5 text-[#F97316]" />
            </div>
            {/* Placeholder chart — replace with real data when API is ready */}
            <div className="h-48 flex items-center justify-center bg-[#FCFBF7] rounded-xl border border-[#E5E4E0]">
              <p className="text-sm text-[#A3A3A3]">Chart data will appear once the admin API is connected</p>
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-[#E5E4E0] rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[#F97316]" />
              <h3 className="text-lg font-bold text-[#1A1A1A]">System Health</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "API Response", value: "—" },
                { label: "RunPod Uptime", value: "—" },
                { label: "Database", value: "—" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#737373]">{item.label}</span>
                    <span className="text-sm font-semibold text-[#A3A3A3]">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F5F0] rounded-full" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Generations & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Generations — empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border border-[#E5E4E0] rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Recent Generations</h3>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Zap className="w-10 h-10 text-[#A3A3A3] mb-3" />
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No generations yet</p>
              <p className="text-xs text-[#737373]">
                Recent generation activity will appear here once the admin API is connected.
              </p>
            </div>
          </motion.div>

          {/* Recent Alerts — empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white border border-[#E5E4E0] rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Recent Alerts</h3>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="w-10 h-10 text-[#A3A3A3] mb-3" />
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">No alerts</p>
              <p className="text-xs text-[#737373]">
                System alerts will appear here once the admin API is connected.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminShell>
  );
}
