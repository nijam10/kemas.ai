"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import Button from "../ui/Button";

const navLinks = [
  { label: "AI Design", href: "/generate" },
  { label: "Design Services", href: "/services" },
  { label: "Tools", href: "/tools" },
  { label: "Printing", href: "/printing" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-xl border-b border-zinc-200/50"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <motion.span
            whileHover={{ scale: 1.02 }}
            className="text-xl font-bold tracking-tight text-brand-navy"
          >
            Kemas<span className="text-brand-accent">.ai</span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-navy/5 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={isActive ? "relative text-brand-navy" : "relative text-zinc-500 hover:text-brand-navy"}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
            <Coins className="w-3.5 h-3.5 text-brand-accent" />
            0 credits
          </div>
          <Button variant="dark" size="sm" className="px-5">
            Log in
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
