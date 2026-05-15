"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  Menu,
  X,
  Search,
  Package,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Credits", href: "/admin/credits", icon: CreditCard },
  { name: "Moderation", href: "/admin/moderation", icon: ShieldCheck },
];

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E4E0] transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E4E0]">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-[#1A1A1A]">Kemas</span>
                  <span className="text-[#F97316]">.ai</span>
                </span>
                <span className="block text-xs text-[#737373]">Admin Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[#737373] hover:text-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#F97316]/10 text-[#F97316]"
                      : "text-[#737373] hover:bg-[#F5F5F0] hover:text-[#1A1A1A]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-[#E5E4E0]">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#737373] hover:bg-[#F5F5F0] hover:text-[#1A1A1A] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to App
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E4E0]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-[#737373] hover:text-[#1A1A1A]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A]">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-[#737373]">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#FCFBF7] border border-[#E5E4E0] rounded-lg">
                <Search className="w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm focus:outline-none w-48"
                />
              </div>

              {/* Admin Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full text-xs font-semibold text-[#F97316]">
                  Admin
                </span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
