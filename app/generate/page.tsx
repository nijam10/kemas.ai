"use client";

import { useState, ChangeEvent } from "react";
// Navbar dihapus dari import
import Sidebar from "../../components/generate/Sidebar";
import PreviewArea from "../../components/generate/PreviewArea";

export default function GeneratePage() {
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    geometry: "Pouch",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    // h-screen memastikan konten memenuhi seluruh layar tanpa Navbar
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      
      {/* 1. SIDEBAR (Kiri) */}
      <aside className="w-96 border-r border-[#E5E1DC] h-full overflow-y-auto shrink-0">
        <Sidebar onChange={handleChange} />
      </aside>
      
      {/* 2. PREVIEW AREA (Kanan/Tengah) */}
      <main className="flex-1 h-full overflow-y-auto relative flex items-center justify-center p-12">
        <PreviewArea data={formData} />
      </main>

    </div>
  );
}