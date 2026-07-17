export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PackagingType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    const packagingType = searchParams.get("packagingType") as PackagingType | null;
    const featuredOnly = searchParams.get("featured") === "true";

    const designs = await prisma.design.findMany({
      where: {
        status: "COMPLETED",
        imageUrl: { not: null },
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

    const mappedTemplates = designs.map(d => ({
      id: d.id,
      title: d.title,
      category: "MODERN_MINIMAL",
      packagingType: d.packagingType,
      previewImageUrl: d.thumbnailUrl || d.imageUrl,
      gradientFrom: null,
      gradientTo: null,
      promptPreset: d.prompt,
      colorMood: "warm",
      styleTags: ["design"],
      description: d.prompt,
      colorPalette: [],
      isFeatured: d.isSaved,
      createdAt: d.createdAt,
      user: {
        name: d.user?.name || "Community",
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        templates: mappedTemplates,
        total: mappedTemplates.length,
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
