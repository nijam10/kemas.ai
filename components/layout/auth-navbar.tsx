"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Menu,
  X,
  CreditCard,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCredits } from "@/hooks/use-credits";
import type { UserRole } from "@prisma/client";

export default function AuthNavbar() {
  const { data: session, status } = useSession();
  const { data: creditsData } = useCredits();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const role = (session?.user?.role ?? null) as UserRole | null;
  const user = session?.user ?? null;
  // Real balance from API; fall back to 40 while loading or on error
  const credits = creditsData?.balance ?? 40;

  // Don't render navbar on auth pages
  if (pathname === "/login" || pathname === "/forgot-password") {
    return null;
  }

  // Navigation items based on auth state
  const navigation = !isAuthenticated
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ]
    : [
        { name: "Generate", href: "/generate" },
        { name: "Gallery", href: "/gallery" },
        { name: "History", href: "/history" },
        { name: "About", href: "/about" },
      ];

  // User dropdown items
  const userMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    ...(role === "ADMIN" ? [{ name: "Admin Panel", href: "/admin", icon: Shield }] : []),
    {
      name: "Logout",
      href: "#",
      icon: LogOut,
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-[#FCFBF7]/80 backdrop-blur-xl border-b border-[#E5E4E0]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#1A1A1A]">Kemas</span>
                <span className="text-[#F97316]">.ai</span>
              </span>
            </Link>
            {/* Skeleton credit badge */}
            <div className="hidden lg:block w-28 h-7 bg-[#F5F5F0] rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || isAuthenticated
          ? "bg-[#FCFBF7]/80 backdrop-blur-xl border-b border-[#E5E4E0]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link href="/" className="group">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#1A1A1A]">Kemas</span>
              <span className="text-[#F97316]">.ai</span>
            </span>
          </Link>

          {/* Desktop Center Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-[#F97316] bg-[#F97316]/10"
                      : "text-[#737373] hover:text-[#1A1A1A] hover:bg-[#E5E4E0]/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="px-6 py-2 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            ) : (
              <>
                {/* Credit Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-full">
                  <CreditCard className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {credits} credits
                  </span>
                </div>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 group"
                  >
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#737373] transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-[220px] bg-white border border-[#E5E4E0] rounded-2xl shadow-lg overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-[#E5E4E0] bg-[#FCFBF7]">
                          <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {user?.name ?? "User"}
                          </p>
                          <p className="text-xs text-[#737373] truncate">{user?.email}</p>
                          {role && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold rounded-full">
                              {role}
                            </span>
                          )}
                        </div>

                        {userMenuItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              setUserMenuOpen(false);
                              if (item.onClick) {
                                item.onClick();
                              } else {
                                router.push(item.href);
                              }
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors text-left",
                              item.name === "Logout" && "text-red-500 hover:bg-red-50"
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#737373] hover:text-[#1A1A1A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#FCFBF7]/95 backdrop-blur-xl border-b border-[#E5E4E0]"
          >
            <div className="px-6 py-6 space-y-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-2 rounded-lg text-base font-medium transition-all duration-200",
                      isActive
                        ? "text-[#F97316] bg-[#F97316]/10"
                        : "text-[#737373] hover:text-[#1A1A1A] hover:bg-[#E5E4E0]/50"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#E5E4E0]">
                {!isAuthenticated ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-lg text-base font-semibold text-center transition-all"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-lg">
                      <CreditCard className="w-4 h-4 text-[#FACC15]" />
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {credits} credits
                      </span>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-[#FCFBF7] rounded-lg border border-[#E5E4E0]">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name ?? "User"}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">
                          {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                          {user?.name ?? "User"}
                        </p>
                        {role && (
                          <span className="inline-block px-2 py-0.5 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold rounded-full">
                            {role}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5E4E0] space-y-1">
                      {userMenuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            if (item.onClick) {
                              item.onClick();
                            } else {
                              router.push(item.href);
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors text-left",
                            item.name === "Logout"
                              ? "text-red-500 hover:bg-red-50"
                              : "text-[#737373] hover:text-[#1A1A1A] hover:bg-[#E5E4E0]/50"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
