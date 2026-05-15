"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CreditCard, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  name?: string;
  image?: string;
  initial?: string;
}

interface SiteNavbarProps {
  variant?: "public" | "user";
  credits?: number;
  user?: User;
}

export default function SiteNavbar({ 
  variant = "public", 
  credits = 40,
  user = { initial: "U" }
}: SiteNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items based on variant
  const navigation = variant === "public" 
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Generate", href: "/generate" },
        { name: "Gallery", href: "/gallery" },
      ]
    : [
        { name: "Generate", href: "/generate" },
        { name: "Gallery", href: "/gallery" },
        { name: "History", href: "/history" },
      ];

  // User menu items
  const userMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Logout", href: "/logout", icon: LogOut },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || variant === "user"
          ? "bg-[#FCFBF7]/80 backdrop-blur-xl border-b border-[#E5E4E0]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark - Always links to landing page */}
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
            {variant === "public" ? (
              // Public: Login button
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                Login
              </Link>
            ) : (
              // User: Credits + Avatar with Dropdown
              <>
                {/* Credit Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-full">
                  <CreditCard className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {credits} credits
                  </span>
                </div>

                {/* User Avatar with Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || "User"} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.initial || user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 text-[#737373] transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-[220px] bg-white border border-[#E5E4E0] rounded-2xl shadow-lg overflow-hidden z-50"
                      >
                        {userMenuItems.map((item, index) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors",
                              index === userMenuItems.length - 1 && "text-red-500 hover:bg-red-50"
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </Link>
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
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
              {/* Mobile Navigation Links */}
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

              {/* Mobile Right Side */}
              <div className="pt-4 border-t border-[#E5E4E0]">
                {variant === "public" ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="space-y-3">
                    {/* Mobile Credits */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-lg">
                      <CreditCard className="w-4 h-4 text-[#FACC15]" />
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {credits} credits
                      </span>
                    </div>

                    {/* Mobile User Info */}
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-sm font-semibold">
                        {user.initial || user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {user.name && (
                        <span className="text-sm font-medium text-[#1A1A1A]">
                          {user.name}
                        </span>
                      )}
                    </div>

                    {/* Mobile User Menu Items */}
                    <div className="pt-2 border-t border-[#E5E4E0] space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors",
                            item.name === "Logout"
                              ? "text-red-500 hover:bg-red-50"
                              : "text-[#737373] hover:text-[#1A1A1A] hover:bg-[#E5E4E0]/50"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </Link>
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
