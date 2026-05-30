"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import TemplateCard from "@/components/gallery/template-card";
import { GALLERY_TEMPLATES, type PackagingTemplate } from "@/lib/gallery-templates";
import { useFavorites } from "@/lib/use-favorites";

interface FavoritesSectionProps {
  onOpenTemplate: (template: PackagingTemplate) => void;
}

export default function FavoritesSection({
  onOpenTemplate,
}: FavoritesSectionProps) {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  const favorites = useMemo(
    () => GALLERY_TEMPLATES.filter((t) => favoriteIds.has(t.id)),
    [favoriteIds]
  );

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Heart className="w-12 h-12 text-[#A3A3A3] mb-4" />
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
          No favorites yet
        </h3>
        <p className="text-sm text-[#737373] mb-6">
          Browse the gallery to save templates you like.
        </p>
        <Link
          href="/gallery"
          className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#F97316]/90 transition-all duration-300 ease-out"
        >
          Browse Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
      {favorites.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isFavorite={isFavorite(template.id)}
          onToggleFavorite={toggleFavorite}
          onOpen={onOpenTemplate}
        />
      ))}
    </div>
  );
}
