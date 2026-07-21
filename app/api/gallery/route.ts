export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PackagingType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    const packagingType = searchParams.get("packagingType") as PackagingType | null;
    const featuredOnly = searchParams.get("featured") === "true";

    const officialTemplates = await prisma.galleryTemplate.findMany({
      where: {
        ...(packagingType && packagingType !== "all" && { packagingType }),
        ...(featuredOnly && { isFeatured: true }),
      },
      orderBy: { createdAt: "desc" },
    });

    const publishedDesigns = await prisma.design.findMany({
      where: {
        status: "COMPLETED",
        imageUrl: { not: null },
        isPublished: true,
        ...(packagingType && packagingType !== "all" && { packagingType }),
        ...(featuredOnly && { isSaved: true }),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: featuredOnly ? 8 : 50,
    });

    const mappedOfficial = officialTemplates.map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      packagingType: t.packagingType,
      previewImageUrl: t.previewImageUrl,
      gradientFrom: null,
      gradientTo: null,
      promptPreset: t.promptPreset,
      colorMood: t.colorMood,
      styleTags: t.styleTags,
      description: t.description,
      colorPalette: [],
      isFeatured: t.isFeatured,
      createdAt: t.createdAt,
      user: {
        name: "Kemas.ai Official",
      }
    }));

    const mappedUserDesigns = publishedDesigns.map(d => ({
      id: d.id,
      title: d.title,
      category: "MODERN_MINIMAL",
      packagingType: d.packagingType,
      previewImageUrl: d.thumbnailUrl || d.imageUrl,
      gradientFrom: null,
      gradientTo: null,
      promptPreset: d.prompt,
      colorMood: "warm",
      styleTags: ["community"],
      description: d.prompt,
      colorPalette: [],
      isFeatured: d.isSaved,
      createdAt: d.createdAt,
      user: {
        name: d.user?.name || "Community User",
      }
    }));

    const allTemplates = [...mappedOfficial, ...mappedUserDesigns];
    // Sort by newest overall
    allTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply limit if featured
    const finalTemplates = featuredOnly ? allTemplates.slice(0, 8) : allTemplates;

    return NextResponse.json({
      success: true,
      data: {
        templates: finalTemplates,
        total: finalTemplates.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
