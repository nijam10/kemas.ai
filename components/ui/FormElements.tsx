"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider font-[var(--font-inter)]">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-accent transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "input-field w-full",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider font-[var(--font-inter)]">
          {label}
        </label>
      )}
      <textarea
        className={cn("input-field w-full resize-none", className)}
        {...props}
      />
    </div>
  );
}

export function Select({
  label,
  children,
  className,
  ...props
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider font-[var(--font-inter)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={cn("input-field w-full appearance-none cursor-pointer pr-10", className)} {...props}>
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
