"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
  onUpload: (file: File | null) => void;
}

export default function LogoUpload({ onUpload }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setFileName(file.name);
      onUpload(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-[#F97316]" />
        <label className="text-sm font-semibold text-[#1A1A1A]">
          Brand Logo
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          onClick={handleClick}
          className="w-full p-6 border-2 border-dashed border-[#E5E4E0] rounded-xl bg-white hover:border-[#F97316]/40 hover:bg-[#F97316]/5 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors">
              <Upload className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                Upload transparent PNG logo
              </p>
              <p className="text-xs text-[#737373]">
                Click to browse or drag and drop
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="relative p-4 border-2 border-[#F97316] rounded-xl bg-[#F97316]/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center overflow-hidden">
              <img
                src={preview}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">
                {fileName}
              </p>
              <p className="text-xs text-[#737373] mt-1">
                Logo uploaded successfully
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="w-8 h-8 rounded-lg bg-white border border-[#E5E4E0] flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-[#737373]">
        Logo will be placed using precise compositing, not generated randomly.
      </p>
    </div>
  );
}
