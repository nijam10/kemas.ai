"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

interface PromptPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptPanel({ value, onChange }: PromptPanelProps) {
  const maxChars = 500;
  const charCount = value.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-[#F97316]" />
        <label className="text-sm font-semibold text-[#1A1A1A]">
          Packaging Prompt
        </label>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Premium cassava chips packaging with warm cream background, orange accents, elegant Indonesian snack branding, clean typography…"
        className="w-full h-32 px-4 py-3 bg-white border border-[#E5E4E0] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all resize-none"
        maxLength={maxChars}
      />

      <div className="flex items-center justify-between text-xs">
        <p className="text-[#737373]">
          Describe product type, flavor, mood, colors, and target audience.
        </p>
        <span className={`font-medium ${charCount > maxChars * 0.9 ? 'text-[#F97316]' : 'text-[#A3A3A3]'}`}>
          {charCount}/{maxChars}
        </span>
      </div>
    </div>
  );
}
