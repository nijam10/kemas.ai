"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Clock, MoreHorizontal } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/Animations";
import { TiltCard } from "@/components/ui/FloatingCard";
import { Spotlight } from "@/components/ui/Effects";
import Button from "@/components/ui/Button";

const projects = [
  { id: 1, title: "Etnivis Cultural Box", type: "Stand-up Pouch", edited: "Edited 2 hours ago", gradient: "from-amber-100 to-orange-50", emoji: "🎨" },
  { id: 2, title: "Batik Lapis Coffee", type: "Mailer Box", edited: "Edited 5 hours ago", gradient: "from-stone-200 to-zinc-100", emoji: "☕" },
  { id: 3, title: "Makaroni Bantet Pack", type: "Pillow Bag", edited: "Edited 1 day ago", gradient: "from-red-100 to-orange-50", emoji: "🍜" },
  { id: 4, title: "Premium Almonds", type: "Stand-up Pouch", edited: "Edited 2 days ago", gradient: "from-green-100 to-emerald-50", emoji: "🥜" },
  { id: 5, title: "Tropical Juice Pouch", type: "Spout Pouch", edited: "Edited 3 days ago", gradient: "from-orange-100 to-yellow-50", emoji: "🍊" },
  { id: 6, title: "Matcha Tea Box", type: "Folding Carton", edited: "Edited 1 week ago", gradient: "from-green-100 to-lime-50", emoji: "🍵" },
];

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 md:p-10 max-w-[1100px]">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">My Projects</h1>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <Spotlight className="flex-1 rounded-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 transition-all duration-300"
              />
            </div>
          </Spotlight>
          <Button variant="outline" size="md" className="rounded-xl">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="dark" size="md" className="rounded-xl">
            <Plus className="w-4 h-4" />
            New Design
          </Button>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.06}>
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <StaggerItem key={project.id}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <TiltCard className="rounded-2xl overflow-hidden">
                  <div className="bg-white rounded-2xl border border-zinc-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">
                    <div className={`h-40 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/50"
                      >
                        <span className="text-3xl">{project.emoji}</span>
                      </motion.div>
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center text-zinc-500 hover:text-brand-navy hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
                            {project.title}
                          </h3>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-brand-accent/10 text-brand-accent text-[10px] font-semibold rounded-md">
                            {project.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <p className="text-[11px] text-zinc-400">{project.edited}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerChildren>

      <FadeIn delay={0.4}>
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" size="md">
            Load More
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
