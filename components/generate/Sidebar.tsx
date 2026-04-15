"use client";
import React, { ChangeEvent } from 'react';

interface SidebarProps {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Sidebar({ onChange }: SidebarProps) {
  return (
    <aside className="w-96 p-8 border-r border-zinc-200 bg-[#FAFAFA] h-screen overflow-y-auto shrink-0 font-jakarta">
      <div className="space-y-8 pb-20">
        
        {/* 1. Product Details */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Product Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 font-inter tracking-wider">Product Name</label>
              <input 
                name="productName"
                onChange={onChange}
                type="text" 
                placeholder="e.g., Premium Chips" 
                className="w-full bg-[#EFEEEC] border border-zinc-300/20 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 ring-amber-500/30 font-inter transition-all placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 font-inter tracking-wider">Brand Name</label>
              <input 
                name="brandName"
                onChange={onChange}
                type="text" 
                placeholder="e.g., SnackCo" 
                className="w-full bg-[#EFEEEC] border border-zinc-300/20 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 ring-amber-500/30 font-inter transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* 2. Brand Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Brand Identity</h3>
          <div className="border-2 border-dashed border-zinc-300/50 rounded-xl p-6 flex flex-col items-center justify-center bg-[#EFEEEC] hover:bg-[#EAE8E5] transition-all cursor-pointer group">
            <div className="text-zinc-400 group-hover:text-amber-600 transition-colors mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-[11px] text-zinc-500 font-inter font-semibold uppercase tracking-tight">Click to upload logo</span>
          </div>
        </div>

        {/* 3. Packaging Geometry */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Packaging Geometry</h3>
          <div className="relative">
            <select 
              name="geometry" 
              onChange={onChange} 
              className="w-full bg-[#EFEEEC] border border-zinc-300/20 rounded-lg px-4 py-2 text-sm outline-none appearance-none cursor-pointer font-inter text-zinc-700"
            >
              <option>Pouch</option>
              <option>Box</option>
              <option>Bottle</option>
            </select>
            <div className="absolute right-3 top-2.5 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Color Customization (Slider) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">Color Customization</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-500 mb-2 font-inter">
                <span>Base Color</span>
                <span className="text-zinc-400 text-lg leading-none">+</span>
              </div>
              <input type="range" className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-zinc-500 mb-2 font-inter">
                <span>Design Style</span>
                <span className="text-zinc-400 text-lg leading-none">+</span>
              </div>
              <input type="range" className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800" />
            </div>
          </div>
        </div>

        {/* 5. Advanced Prompting */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-tight font-jakarta">Advanced Prompting</h3>
          <div className="relative">
            <textarea 
              placeholder="Describe any additional details..." 
              className="w-full bg-[#EFEEEC] border border-zinc-300/20 rounded-lg p-4 h-28 text-sm resize-none outline-none focus:ring-1 ring-amber-500/30 placeholder:text-zinc-400 font-inter"
            ></textarea>
            <button className="absolute bottom-3 right-3 text-zinc-400 hover:text-zinc-800 transition-colors">
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