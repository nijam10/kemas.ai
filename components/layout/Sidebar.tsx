"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  FolderOpen,
  WandSparkles,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  { name: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { name: "My Projects", icon: FolderOpen, href: "/project" },
  { name: "Brand Kits", icon: WandSparkles, href: "/brand" },
  { name: "Billing & Credits", icon: CreditCard, href: "/billing" },
  { name: "API Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-[260px] min-h-screen bg-white/60 backdrop-blur-sm border-r border-zinc-200/60 p-4 flex flex-col"
    >
      <Link href="/" className="px-3 pt-2 pb-4 block">
        <span className="text-lg font-bold tracking-tight text-brand-navy">
          Kemas<span className="text-brand-accent">.ai</span>
        </span>
      </Link>

      <div className="bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-2xl p-4 mb-6 shadow-lg shadow-brand-navy/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/20">
            KN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Khairul Nizam</p>
            <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full font-medium">
              Pro Plan
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60">Credits remaining</span>
            <span className="text-white font-semibold">24 / 50</span>
          </div>
          <div className="mt-1.5 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "48%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-brand-accent rounded-full"
            />
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menu.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-brand-navy"
                  : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-brand-accent/10 border border-brand-accent/20 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className={cn("w-[18px] h-[18px] relative z-10", isActive ? "text-brand-accent" : "")} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto relative z-10 text-brand-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200 mt-2">
        <LogOut className="w-[18px] h-[18px]" />
        <span>Logout</span>
      </button>
    </motion.aside>
  );
}
