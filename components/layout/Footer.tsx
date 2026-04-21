"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-zinc-200/50 bg-white/40 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-brand-navy">
              Kemas<span className="text-brand-accent">.ai</span>
            </span>
            <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
              AI-powered packaging design for Indonesian UMKM & local food brands.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/generate" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">AI Design</Link>
              <Link href="/tools" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Tools</Link>
              <Link href="/printing" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Printing</Link>
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">About</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Blog</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-brand-navy transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">&copy; 2026 Kemas.ai. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="text-xs">Made with AI for Indonesian Creators</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
