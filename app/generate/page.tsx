"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import GenerateSidebar from "@/components/generate/Sidebar";
import PreviewArea from "@/components/generate/PreviewArea";
import Link from "next/link";

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
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-[380px] border-r border-input-border h-full overflow-y-auto shrink-0 bg-white/40 backdrop-blur-sm"
      >
        <div className="p-4 border-b border-input-border">
          <Link href="/" className="text-lg font-bold tracking-tight text-brand-navy">
            Kemas<span className="text-brand-accent">.ai</span>
          </Link>
        </div>
        <GenerateSidebar onChange={handleChange} />
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 h-full overflow-y-auto relative flex items-center justify-center p-12"
      >
        <PreviewArea data={formData} />
      </motion.main>
    </div>
  );
}
