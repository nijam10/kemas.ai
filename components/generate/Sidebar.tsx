"use client";
import React, { ChangeEvent } from 'react';

interface SidebarProps {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Sidebar({ onChange }: SidebarProps) {
  return (
    <aside className="w-96 p-8 border-r border-[#E5E1DC] bg-[#FBFAF8] h-full overflow-y-auto shrink-0 font-jakarta">
      <div className="space-y-8 pb-32">
        
        {/* Header Kecil Studio */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-brand-navy">Generation Studio</h2>
          <p className="text-xs text-zinc-400 font-inter mt-1">Configure your packaging design below</p>
        </div>

        {/* 1. Product Details */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-tight">Product Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 font-inter tracking-wider">Product Name</label>
              <input 
                name="productName"
                onChange={onChange}
                type="text" 
                placeholder="e.g., Premium Chips" 
                className="input-field w-full focus:border-[#E4AB5A] focus:ring-4 focus:ring-[#E4AB5A]/10 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 font-inter tracking-wider">Brand Name</label>
              <input 
                name="brandName"
                onChange={onChange}
                type="text" 
                placeholder="e.g., SnackCo" 
                className="input-field w-full focus:border-[#E4AB5A] focus:ring-4 focus:ring-[#E4AB5A]/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2. Brand Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-tight">Brand Identity</h3>
          <div className="border-2 border-dashed border-[#E5E1DC] rounded-xl p-6 flex flex-col items-center justify-center bg-[#F8F5F1] hover:bg-[#F1EFEA] transition-all cursor-pointer group text-center">
            <div className="text-zinc-400 group-hover:text-[#E4AB5A] transition-colors mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-[10px] text-zinc-500 font-inter font-bold uppercase tracking-tight">Click to upload logo</span>
          </div>
        </div>

        {/* 3. Packaging Geometry - UPDATE DAFTAR OPSI */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-tight">Packaging Geometry</h3>
          <div className="relative">
            <select 
              name="geometry" 
              onChange={onChange} 
              className="input-field w-full appearance-none cursor-pointer pr-10 focus:border-[#E4AB5A] focus:ring-4 focus:ring-[#E4AB5A]/10 transition-all"
            >
              <option value="Bottle">Bottle</option>
              <option value="Pillow">Pillow</option>
              <option value="Flat">Flat</option>
              <option value="Box">Box</option>
              <option value="Spouted Stand">Spouted Stand</option>
              <option value="Stand">Stand</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Color Customization */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-tight">Color Customization</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-500 mb-2 font-inter uppercase font-bold tracking-wider">
                <span>Base Color</span>
                <span className="text-zinc-400">+</span>
              </div>
              <input type="range" className="w-full h-1 bg-[#E5E1DC] rounded-lg appearance-none cursor-pointer accent-brand-navy" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-zinc-500 mb-2 font-inter uppercase font-bold tracking-wider">
                <span>Design Style</span>
                <span className="text-zinc-400">+</span>
              </div>
              <input type="range" className="w-full h-1 bg-[#E5E1DC] rounded-lg appearance-none cursor-pointer accent-brand-navy" />
            </div>
          </div>
        </div>

        {/* 5. Advanced Prompting */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-navy uppercase tracking-tight">Advanced Prompting</h3>
          <div className="relative">
            <textarea 
              placeholder="Describe any additional details..." 
              className="input-field w-full h-28 resize-none pr-12 focus:border-[#E4AB5A] focus:ring-4 focus:ring-[#E4AB5A]/10 transition-all"
            ></textarea>
            <button className="absolute bottom-3 right-3 text-zinc-400 hover:text-[#E4AB5A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}