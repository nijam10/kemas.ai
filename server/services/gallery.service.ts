/**
 * Gallery Service
 * Read-only queries for gallery templates.
 */

import { prisma } from "@/lib/prisma";
import type { GalleryTemplate, GalleryCategory, PackagingType } from "@prisma/client";

export interface GalleryFilters {
  category?: GalleryCategory;
  packagingType?: PackagingType;
  featuredOnly?: boolean;
}

export class GalleryService {
  /**
   * Get all gallery templates, optionally filtered.
   * Featured templates are returned first.
   */
  async getTemplates(filters: GalleryFilters = {}): Promise<GalleryTemplate[]> {
    return prisma.galleryTemplate.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.packagingType && { packagingType: filters.packagingType }),
        ...(filters.featuredOnly && { isFeatured: true }),
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "asc" },
      ],
    });
  }

  /**
   * Get a single template by its URL slug.
   */
  async getTemplateBySlug(slug: string): Promise<GalleryTemplate | null> {
    return prisma.galleryTemplate.findUnique({ where: { slug } });
  }

  /**
   * Get only featured templates.
   */
  async getFeaturedTemplates(): Promise<GalleryTemplate[]> {
    return this.getTemplates({ featuredOnly: true });
  }
}

export const galleryService = new GalleryService();
