"use client";
import React from 'react';

interface PreviewProps {
  data: { productName: string; brandName: string; geometry: string; };
}

export default function PreviewArea({ data }: PreviewProps) {
  return (
    <main className="flex-1 flex items-center justify-center p-12 bg-transparent font-jakarta">
      
      {/* 1. CONTAINER UTAMA - Dibuat memanjang ke bawah (max-w-md & aspect-[3/4]) */}
      <div className="bg-[#FBFAF8] w-full max-w-md aspect-[3/4] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center relative border-2 border-[#E5E1DC]">
        
        {/* Dekorasi Bintang Orange SAMAR (✦) */}
        <span className="absolute top-10 right-10 text-[#E4AB5A] text-lg opacity-40">✦</span>
        <span className="absolute bottom-10 left-10 text-[#E4AB5A] text-sm opacity-25">✦</span>

        {/* 2. MOCKUP BOX - Gradasi Linear E4AB5A 20% & 272C35 13% */}
        {/* Dash border diubah warnanya menjadi E4AB5A dengan opasitas 40% */}
        <div 
          className="w-64 h-80 rounded-[14px] border-2 border-dashed flex flex-col items-center justify-center mb-10 relative group transition-all duration-500 overflow-hidden"
          style={{
            borderColor: 'rgba(228, 171, 90, 0.4)', // E4AB5A 40%
            background: `linear-gradient(180deg, 
              rgba(228, 171, 90, 0.2) 0%,   /* E4AB5A 20% */
              rgba(39, 44, 53, 0.13) 100%   /* 272C35 13% */
            )`,
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="z-10 flex flex-col items-center text-center px-6">
            {/* Ikon Box */}
            <div className="w-11 h-11 bg-white/40 rounded-xl flex items-center justify-center mb-5 shadow-sm border border-white/20">
              <span className="text-xl grayscale opacity-50">📦</span>
            </div>
            
            {/* Teks Produk */}
            <h2 className="text-xl font-extrabold text-[#1D242D] leading-tight tracking-tight">
              {data.productName || "Your Product"}
            </h2>
            <p className="text-xs text-zinc-600 font-inter mt-1 font-medium">
              {data.brandName || "Brand Name"}
            </p>
          </div>

          {/* Label Mockup Type Glassmorphism */}
          <div className="absolute bottom-6 px-4 py-1.5 bg-white/50 backdrop-blur-md border border-white/40 rounded-full text-[9px] font-black text-[#1D242D] uppercase tracking-[0.2em] font-inter shadow-sm">
            {data.geometry} Mockup
          </div>
        </div>

        {/* 3. INFO TEXT Bawah */}
        <div className="text-center px-8">
          <h4 className="text-lg font-bold text-[#1D242D] tracking-tight">Live Preview</h4>
          <p className="text-[12px] text-zinc-400 font-inter mt-1 leading-relaxed">
            Visualizing your AI-generated packaging design in real-time
          </p>
        </div>
        
      </div>
    </main>
  );
}