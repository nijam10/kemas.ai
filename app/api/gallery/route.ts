import { NextRequest, NextResponse } from "next/server";
import { galleryService } from "@/server/services/gallery.service";
import type { GalleryCategory, PackagingType } from "@prisma/client";

/**
 * GET /api/gallery
 *
 * Returns gallery templates from the database.
 *
 * Query params (all optional):
 *   category       — filter by GalleryCategory enum value
 *   packagingType  — filter by PackagingType enum value
 *   featured       — "true" to return featured templates only
 *
 * Response:
 *   { success: true, data: { templates: GalleryTemplate[], total: number } }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get("category") as GalleryCategory | null;
    const packagingType = searchParams.get("packagingType") as PackagingType | null;
    const featuredOnly = searchParams.get("featured") === "true";

    const templates = await galleryService.getTemplates({
      ...(category && { category }),
      ...(packagingType && { packagingType }),
      ...(featuredOnly && { featuredOnly }),
    });

    return NextResponse.json({
      success: true,
      data: {
        templates,
        total: templates.length,
      },
    });
  } catch (error) {
    console.error("[GET /api/gallery]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery templates" },
      { status: 500 }
    );
  }
}
