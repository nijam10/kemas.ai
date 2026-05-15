"use client";

import { Eye, Download, Save, Package, Clock } from "lucide-react";

interface GenerationPreviewProps {
  prompt: string;
  packagingType: string;
  onSave?: () => void;
  onDownload?: () => void;
  onPreview3D?: () => void;
}

export default function GenerationPreview({
  prompt,
  packagingType,
  onSave,
  onDownload,
  onPreview3D,
}: GenerationPreviewProps) {
  // Mock timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#E5E4E0]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
              Generated Design
            </h3>
            <p className="text-sm text-[#737373] line-clamp-2">
              {prompt}
            </p>
          </div>
          <span className="ml-4 px-3 py-1 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-full text-xs font-semibold text-[#1A1A1A] whitespace-nowrap">
            {packagingType}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
          <Clock className="w-3.5 h-3.5" />
          <span>{timestamp}</span>
        </div>
      </div>

      {/* Preview Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FCFBF7] to-[#F5F5F0]">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-40 h-52 mx-auto mb-6 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Package className="w-20 h-20 text-white" />
            </div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">
              Your premium packaging design
            </p>
            <p className="text-xs text-[#737373]">
              Ready for 3D preview and download
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        {/* Primary CTA - Preview in 3D */}
        <button
          onClick={onPreview3D}
          className="w-full group flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#F97316] hover:bg-[#F97316] text-[#F97316] hover:text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-lg"
        >
          <Eye className="w-5 h-5" />
          <span>Preview in 3D</span>
          <svg 
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSave}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/20 text-[#1A1A1A] rounded-xl font-medium transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            Save to Gallery
          </button>
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] hover:border-[#F97316]/20 text-[#1A1A1A] rounded-xl font-medium transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Credit Usage Info */}
        <div className="pt-3 border-t border-[#E5E4E0]">
          <p className="text-xs text-center text-[#737373]">
            10 credits were used for this generation
          </p>
        </div>
      </div>
    </div>
  );
}
