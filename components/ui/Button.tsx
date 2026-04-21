"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  isLoading,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none gap-2 cursor-pointer overflow-hidden";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-br from-[#E4AB5A] to-[#D49840] text-white rounded-xl shadow-[0_8px_30px_-8px_rgba(228,171,90,0.5)] hover:shadow-[0_12px_40px_-8px_rgba(228,171,90,0.6)] hover:scale-[1.02]",
    dark: "bg-[#1D1D1F] text-white rounded-full shadow-lg hover:bg-[#2A2A2C] hover:shadow-xl hover:translate-y-[-2px]",
    outline:
      "border-2 border-zinc-200 bg-white text-zinc-700 rounded-xl hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md",
    ghost:
      "text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100/60",
    accent:
      "bg-brand-accent text-white rounded-xl hover:bg-brand-accent-dark shadow-[0_8px_30px_-8px_rgba(228,171,90,0.4)] hover:shadow-[0_12px_40px_-8px_rgba(228,171,90,0.5)] hover:scale-[1.02]",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
