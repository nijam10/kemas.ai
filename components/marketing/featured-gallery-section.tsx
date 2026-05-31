"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TemplateCard from "@/components/gallery/template-card";
import TemplateDetailModal from "@/components/gallery/template-detail-modal";
import { useFavorites } from "@/lib/use-favorites";
import type { PackagingTemplate } from "@/lib/gallery-templates";

// Featured designs shaped as full PackagingTemplate objects so they can reuse
// the exact same TemplateCard + TemplateDetailModal (identical hover + select
// behaviour as the Gallery page). Decorative gradients/palettes per product mood.
const FEATURED_TEMPLATES: PackagingTemplate[] = [
  {
    id: "kriuk-tempe-original",
    name: "Kriuk Tempe Original",
    packagingType: "standing-pouch",
    gradientFrom: "#FBF3E2",
    gradientTo: "#D9B98A",
    styleTags: ["warm", "traditional", "snack"],
    description:
      "A warm, traditional look for crispy tempe snacks. Cream-to-tan tones give an authentic homemade feel suited to everyday UMKM snack retail.",
    colorPalette: ["#FBF3E2", "#D9B98A", "#9E6B1F", "#1A1A1A"],
    badge: "popular",
    usageCount: 1320,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "pisang-salju",
    name: "Pisang Salju",
    packagingType: "pillow-pouch",
    gradientFrom: "#F4B9A6",
    gradientTo: "#E07A5F",
    styleTags: ["playful", "fruit", "warm"],
    description:
      "A friendly, fruit-forward style for dried banana snacks. Soft rose and coral tones feel approachable and homemade.",
    colorPalette: ["#F4B9A6", "#E07A5F", "#FBF3E2", "#A84A35"],
    usageCount: 740,
    createdAt: "2026-02-08T09:00:00.000Z",
  },
  {
    id: "kopi-nusantara",
    name: "Kopi Nusantara",
    packagingType: "bottle",
    gradientFrom: "#3A3A3A",
    gradientTo: "#1C1C1C",
    styleTags: ["premium", "bold", "coffee"],
    description:
      "A confident, dark aesthetic for premium archipelago coffee. Charcoal tones convey depth and a specialty positioning.",
    colorPalette: ["#3A3A3A", "#1C1C1C", "#D98A28", "#9A9A9A"],
    badge: "popular",
    usageCount: 1180,
    createdAt: "2026-01-22T09:00:00.000Z",
  },
  {
    id: "sambal-bawang-pedas",
    name: "Sambal Bawang Pedas",
    packagingType: "jar",
    gradientFrom: "#E0793C",
    gradientTo: "#9E3621",
    styleTags: ["bold", "spicy", "condiment"],
    description:
      "A fiery jar style for ready-to-use chili sambal. Terra and red-clay tones signal heat while staying appetizing.",
    colorPalette: ["#E0793C", "#9E3621", "#F6C453", "#5E1B12"],
    usageCount: 960,
    createdAt: "2026-02-19T09:00:00.000Z",
  },
  {
    id: "ubi-ungu-chips",
    name: "Ubi Ungu Chips",
    packagingType: "standing-pouch",
    gradientFrom: "#8B6FB0",
    gradientTo: "#5B3E80",
    styleTags: ["vibrant", "modern", "snack"],
    description:
      "A vibrant, modern direction for purple sweet-potato chips. Violet tones make the product pop on shelf.",
    colorPalette: ["#8B6FB0", "#5B3E80", "#F4B9A6", "#2E1F44"],
    badge: "new",
    usageCount: 520,
    createdAt: "2026-05-20T09:00:00.000Z",
  },
  {
    id: "granola-bites",
    name: "Granola Bites",
    packagingType: "box",
    gradientFrom: "#A8B89A",
    gradientTo: "#3F5E47",
    styleTags: ["organic", "minimal", "healthy"],
    description:
      "A natural, wholesome look for granola bites. Sage and forest-green tones lean into a better-for-you positioning.",
    colorPalette: ["#A8B89A", "#3F5E47", "#FBF3E2", "#23351F"],
    usageCount: 880,
    createdAt: "2026-03-02T09:00:00.000Z",
  },
  {
    id: "keripik-nangka",
    name: "Keripik Nangka",
    packagingType: "pillow-pouch",
    gradientFrom: "#F6C453",
    gradientTo: "#D98A28",
    styleTags: ["classic", "warm", "snack"],
    description:
      "A golden, classic style for jackfruit chips. Honey-amber tones feel premium and gift-ready for oleh-oleh retail.",
    colorPalette: ["#F6C453", "#D98A28", "#FBF3E2", "#8A5A12"],
    usageCount: 690,
    createdAt: "2026-03-14T09:00:00.000Z",
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    packagingType: "bottle",
    gradientFrom: "#9DBF7E",
    gradientTo: "#5E7D4F",
    styleTags: ["fresh", "modern", "beverage"],
    description:
      "A fresh, modern look for bottled matcha latte. Green tones communicate a clean, natural beverage.",
    colorPalette: ["#9DBF7E", "#5E7D4F", "#FBF3E2", "#33492A"],
    badge: "new",
    usageCount: 610,
    createdAt: "2026-05-12T09:00:00.000Z",
  },
];

export default function FeaturedGallerySection() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedTemplate, setSelectedTemplate] =
    useState<PackagingTemplate | null>(null);

  return (
    <section className="py-24 px-6 bg-white border-t border-[#E5E4E0]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Featured Packaging Designs
          </h2>
          <p className="text-base md:text-lg text-[#737373] max-w-2xl mx-auto">
            Real packaging concepts generated for Indonesian UMKM brands.
          </p>
        </motion.div>

        {/* Grid — reuses the exact Gallery TemplateCard (identical hover + select) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURED_TEMPLATES.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
            >
              <TemplateCard
                template={template}
                isFavorite={isFavorite(template.id)}
                onToggleFavorite={toggleFavorite}
                onOpen={setSelectedTemplate}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-16"
        >
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#F97316] text-[#F97316] bg-white font-semibold hover:bg-[#F97316]/5 transition-all duration-300 ease-out"
          >
            View Full Gallery (127+ Designs)
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Template detail modal — identical to the Gallery page */}
      <TemplateDetailModal
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </section>
  );
}
