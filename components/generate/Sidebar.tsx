"use client";
import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Upload, Send } from "lucide-react";
import Button from "../ui/Button";

interface SidebarProps {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function Sidebar({ onChange }: SidebarProps) {
  return (
    <div className="p-6 space-y-7 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-lg font-bold text-brand-navy">Generation Studio</h2>
        <p className="text-xs text-zinc-400 mt-1">Configure your packaging design below</p>
      </motion.div>

      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">1</span>
          Product Details
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 tracking-wider">Product Name</label>
            <input name="productName" onChange={onChange} type="text" placeholder="e.g., Premium Chips" className="input-field w-full" />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 uppercase font-bold block mb-1.5 tracking-wider">Brand Name</label>
            <input name="brandName" onChange={onChange} type="text" placeholder="e.g., SnackCo" className="input-field w-full" />
          </div>
        </div>
      </motion.div>

      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
        <h3 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">2</span>
          Brand Identity
        </h3>
        <motion.div
          whileHover={{ borderColor: "rgba(228,171,90,0.4)", backgroundColor: "rgba(248,245,241,0.8)" }}
          className="border-2 border-dashed border-input-border rounded-xl p-6 flex flex-col items-center justify-center bg-input-bg cursor-pointer group text-center transition-all duration-300"
        >
          <Upload className="w-5 h-5 text-zinc-400 group-hover:text-brand-accent transition-colors mb-2" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Click to upload logo</span>
        </motion.div>
      </motion.div>

      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
        <h3 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">3</span>
          Packaging Geometry
        </h3>
        <div className="relative">
          <select name="geometry" onChange={onChange} className="input-field w-full appearance-none cursor-pointer pr-10">
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
      </motion.div>

      <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
        <h3 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">4</span>
          Color Customization
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-2 uppercase font-bold tracking-wider">
              <span>Base Color</span>
              <div className="w-4 h-4 rounded-full bg-brand-accent/30 border border-brand-accent/50" />
            </div>
            <input type="range" className="w-full h-1.5 bg-input-border rounded-full appearance-none cursor-pointer accent-brand-accent" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-2 uppercase font-bold tracking-wider">
              <span>Design Style</span>
              <div className="w-4 h-4 rounded-full bg-brand-navy/20 border border-brand-navy/30" />
            </div>
            <input type="range" className="w-full h-1.5 bg-input-border rounded-full appearance-none cursor-pointer accent-brand-navy" />
          </div>
        </div>
      </motion.div>

      <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-3">
        <h3 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">5</span>
          Advanced Prompting
        </h3>
        <div className="relative">
          <textarea placeholder="Describe any additional details for the AI..." className="input-field w-full h-28 resize-none pr-12" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-white transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div custom={5} variants={sectionVariants} initial="hidden" animate="visible" className="pt-4">
        <Button variant="primary" size="lg" className="w-full rounded-xl">
          Generate Design
        </Button>
      </motion.div>
    </div>
  );
}
