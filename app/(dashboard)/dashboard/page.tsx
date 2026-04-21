"use client";

import { motion } from "framer-motion";
import { Coins, HardDrive, ArrowRight, Clock, Box } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/Animations";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

const recentProjects = [
  { title: "Etnivis Coffee Box", edited: "Last edited 2 days ago", type: "Box", gradient: "from-amber-100 to-orange-50" },
  { title: "Spicy Macaroni", edited: "Last edited 5 days ago", type: "Pouch", gradient: "from-red-100 to-orange-50" },
  { title: "Batik Lapis Tea", edited: "Last edited 1 week ago", type: "Sachet", gradient: "from-green-100 to-emerald-50" },
  { title: "Herbal Honey Jar", edited: "Last edited 2 weeks ago", type: "Jar", gradient: "from-yellow-100 to-amber-50" },
  { title: "Coconut Oil Bottle", edited: "Last edited 3 weeks ago", type: "Box", gradient: "from-lime-100 to-green-50" },
  { title: "Sambal Nusantara", edited: "Last edited 1 month ago", type: "Pouch", gradient: "from-red-100 to-rose-50" },
];

export default function DashboardPage() {
  return (
    <div className="p-8 md:p-10 max-w-[1100px]">
      <FadeIn>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Welcome back, Khairul!</h1>
          <p className="text-zinc-500 text-sm">Manage your packaging designs and account settings.</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <FadeIn delay={0.1}>
          <Card glow className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-accent/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-brand-accent" />
                  </div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Available Credits</span>
                </div>
                <Link href="/billing">
                  <Button variant="accent" size="sm" className="rounded-xl text-[11px]">
                    Buy Credits <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-brand-navy">120</span>
                <span className="text-sm text-zinc-400 mb-1">of 200 credits remaining</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-accent to-brand-accent-dark rounded-full"
                />
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cloud Storage</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-brand-navy">4.2</span>
                <span className="text-sm text-zinc-400 mb-1">GB</span>
                <span className="text-sm text-zinc-400 mb-1">of 10 GB</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "42%" }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">5.8 GB free space remaining</p>
            </div>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Recent Projects</h2>
          <Link href="/project">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
        {recentProjects.map((project) => (
          <StaggerItem key={project.title}>
            <motion.div whileHover={{ y: -3 }} className="group cursor-pointer">
              <div className="bg-white rounded-2xl border border-zinc-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className={`h-32 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/50">
                    <Box className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/70 backdrop-blur-sm rounded-md text-[10px] font-semibold text-zinc-600">
                    {project.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <p className="text-[11px] text-zinc-400">{project.edited}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
