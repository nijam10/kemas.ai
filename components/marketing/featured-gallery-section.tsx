"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TemplateCard from "@/components/gallery/template-card";
import TemplateDetailModal from "@/components/gallery/template-detail-modal";
import { useFavorites } from "@/lib/use-favorites";
import type { PackagingTemplate } from "@/lib/gallery-templates";

export default function FeaturedGallerySection() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedTemplate, setSelectedTemplate] =
    useState<PackagingTemplate | null>(null);
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gallery?featured=true")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const mapped = data.data.templates.map((t: any) => ({
            id: t.id,
            name: t.title,
            category: t.category,
            packagingType: t.packagingType,
            thumbnailUrl: t.previewImageUrl,
            fullImageUrl: t.previewImageUrl,
            promptPreset: t.promptPreset,
            styleTags: t.styleTags,
            colorMood: t.colorMood,
            badge: t.isFeatured ? "featured" : undefined,
            usageCount: 0,
            createdAt: t.createdAt,
            author: { name: "Community" }
          }));
          setFeaturedTemplates(mapped.slice(0, 8)); // Max 8 items
        }
      });
  }, []);

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
          {featuredTemplates.length > 0 ? (
            featuredTemplates.map((template, index) => (
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
            ))
          ) : (
            <div className="col-span-2 lg:col-span-4 text-center py-12 text-[#737373]">
              Featured designs will appear here.
            </div>
          )}
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
