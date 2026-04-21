"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      className={cn(
        "rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow duration-500",
        hover && "hover:shadow-xl hover:border-zinc-300/80",
        glow && "hover:shadow-[0_0_40px_rgba(228,171,90,0.12)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  accent = false,
}: {
  label: string;
  value: string | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={cn("relative overflow-hidden", accent && "border-brand-accent/20")}>
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none" />
      )}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
          <div className="text-2xl font-bold text-brand-navy">{value}</div>
          {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            accent ? "bg-brand-accent/10 text-brand-accent" : "bg-zinc-100 text-zinc-500"
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
