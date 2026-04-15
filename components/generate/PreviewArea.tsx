"use client";
import React from 'react';

interface PreviewProps {
  data: { productName: string; brandName: string; geometry: string; };
}

export default function PreviewArea({ data }: PreviewProps) {
  return (
    <main className="flex-1 flex items-center justify-center p-12 bg-[#FAFAFA] font-jakarta">
      <div className="bg-white w-full max-w-2xl aspect-[4/3] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center relative border border-white">
        
        {/* Mockup Box */}
        {/* WARNA GARIS DIGANTI: dari border-[#E4AB5A]/40 menjadi border-zinc-300/50 */}
        <div className="w-64 h-80 bg-[#E5E1DC] rounded-2xl border-2 border-dashed border-zinc-300/50 flex flex-col items-center justify-center mb-8 relative shadow-sm">
          <div className="z-10 flex flex-col items-center text-center px-6">
            <span className="text-4xl mb-4 grayscale opacity-20 text-zinc-500">📦</span>
            <h2 className="text-xl font-bold text-zinc-800 leading-tight">
              {data.productName || "Your Product"}
            </h2>
            <p className="text-xs text-zinc-500 font-inter mt-2">
              {data.brandName || "Brand Name"}
            </p>
          </div>

          <div className="absolute bottom-6 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] border border-white/40 font-inter">
            {data.geometry} Mockup
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-lg font-bold text-zinc-800">Live Preview</h4>
          <p className="text-[12px] text-zinc-400 font-inter mt-1">
            Visualizing your AI-generated packaging
          </p>
        </div>
        
        {/* Dekorasi bintang tetap amber untuk aksen, atau bisa kamu hapus jika ingin full abu-abu */}
        <span className="absolute top-12 right-12 text-[#E4AB5A] text-xl opacity-20">✦</span>
        <span className="absolute bottom-16 left-12 text-[#E4AB5A] text-sm opacity-15">✦</span>
      </div>
    </main>
  );
}