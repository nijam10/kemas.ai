"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "../ui/Animations";
import { TiltCard } from "../ui/FloatingCard";
import { Spotlight } from "../ui/Effects";

const categories = ["All", "Food & Beverages", "Artisan Snacks", "Modern Minimalist", "Traditional"];

const mockups = [
  { id: 1, title: "Premium Chips", tag: "Artisan Snacks", gradient: "from-amber-100 via-amber-50 to-orange-50", emoji: "🍿" },
  { id: 2, title: "Botanical Box", tag: "Traditional", gradient: "from-green-50 via-emerald-50 to-teal-50", emoji: "🌿" },
  { id: 3, title: "Tropical Fruit", tag: "Food & Beverages", gradient: "from-orange-100 via-yellow-50 to-amber-50", emoji: "🍊" },
  { id: 4, title: "Matcha Green", tag: "Food & Beverages", gradient: "from-green-100 via-green-50 to-emerald-50", emoji: "🍵" },
  { id: 5, title: "Artisan Cookies", tag: "Artisan Snacks", gradient: "from-amber-50 via-yellow-50 to-orange-50", emoji: "🍪" },
  { id: 6, title: "Luxury Chocolate", tag: "Modern Minimalist", gradient: "from-zinc-200 via-zinc-100 to-stone-100", emoji: "🍫" },
];

export default function ExploreGallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockups.filter((item) => {
    const matchesCategory = activeFilter === "All" || item.tag === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <FadeIn>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Explore AI-Generated Styles
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            Browse stunning packaging designs created by our AI. Find your style and make it yours.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="max-w-2xl mx-auto flex flex-col gap-5 mb-14">
          <Spotlight className="rounded-full">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-13 pr-4 py-4 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all duration-300 text-sm"
              />
            </div>
          </Spotlight>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="gallery-filter"
                    className="absolute inset-0 bg-brand-navy rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <StaggerItem key={item.id}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <TiltCard className="rounded-3xl">
                  <div className="group cursor-pointer">
                    <div className={`w-full aspect-[4/5] bg-gradient-to-br ${item.gradient} rounded-3xl mb-4 overflow-hidden relative border border-zinc-100/80 transition-all duration-500 group-hover:shadow-2xl`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg flex items-center justify-center border border-white/50"
                        >
                          <span className="text-4xl">{item.emoji}</span>
                        </motion.div>
                        <p className="text-xs font-semibold text-brand-navy/60 uppercase tracking-wider">{item.tag}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-400">{item.tag}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerChildren>
    </section>
  );
}
