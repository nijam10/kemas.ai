"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderOpen,
  WandSparkles,
  CreditCard,
  Settings,
  Power,
} from "lucide-react";

const menu = [
  {
    name: "Overview",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    name: "My Projects",
    icon: FolderOpen,
    href: "/project",
  },
  {
    name: "Brand Kits",
    icon: WandSparkles,
    href: "/brand",
  },
  {
    name: "Billing & Credits",
    icon: CreditCard,
    href: "/billing",
  },
  {
    name: "API Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#FAFAFA] border-r border-gray-200 p-5 flex flex-col">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            KN
          </div>
          <div>
            <p className="text-sm font-semibold">Khairul Nizam</p>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">
              Pro Plan
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 flex-1">
        {menu.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl border transition
                ${
                  isActive
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white border-gray-100 hover:shadow-sm"
                }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:bg-red-50 transition text-sm">
        <Power className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}