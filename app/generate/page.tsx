"use client";

import { useState, ChangeEvent } from "react";
// Import Navbar dari folder layout
import Navbar from "../../components/layout/Navbar"; 
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAFAFA]">
      {/* 1. Panggil Navbar di paling atas */}
      <Navbar />

      {/* 2. Container untuk Sidebar dan Preview */}
      {/* Kita gunakan h-[calc(100vh-64px)] agar tingginya pas (layar penuh dikurangi tinggi navbar 64px) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Kiri */}
        <Sidebar onChange={handleChange} />
        
        {/* Preview Area Kanan */}
        <PreviewArea data={formData} />
      </div>
    </div>
  );
}