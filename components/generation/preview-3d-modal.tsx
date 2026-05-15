"use client";

import { X, Box, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect } from "react";

interface Preview3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  packagingType: string;
}

export default function Preview3DModal({ isOpen, onClose, packagingType }: Preview3DModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4E0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
              <Box className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                3D Preview
              </h3>
              <p className="text-xs text-[#737373]">
                {packagingType} mockup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-[#E5E4E0] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#737373]" />
          </button>
        </div>

        {/* 3D Preview Area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#FCFBF7] via-[#F5F5F0] to-[#FCFBF7]">
          {/* Placeholder 3D Mockup */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              {/* Mock 3D Package */}
              <div className="relative w-64 h-80 mx-auto mb-8">
                {/* Shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-[#1A1A1A]/10 rounded-full blur-xl" />
                
                {/* Package */}
                <div className="relative w-full h-full bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-3xl shadow-2xl transform hover:rotate-y-12 transition-transform duration-500 flex items-center justify-center">
                  <Box className="w-24 h-24 text-white opacity-50" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#1A1A1A]">
                  Interactive 3D Preview Coming Soon
                </h4>
                <p className="text-sm text-[#737373] max-w-md mx-auto">
                  Full 360° rotatable mockup with realistic lighting and materials will be available in the next update.
                </p>
              </div>
            </div>
          </div>

          {/* Control Hints */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E5E4E0] rounded-full shadow-lg">
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <RotateCw className="w-4 h-4" />
              <span>Rotate</span>
            </div>
            <div className="w-px h-4 bg-[#E5E4E0]" />
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <ZoomIn className="w-4 h-4" />
              <span>Zoom</span>
            </div>
            <div className="w-px h-4 bg-[#E5E4E0]" />
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <ZoomOut className="w-4 h-4" />
              <span>Pan</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E4E0] bg-[#FCFBF7]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#737373]">
              Tip: Use mouse to rotate and zoom the 3D mockup
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
