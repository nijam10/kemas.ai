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

    // A set of beautiful gradient pairs for fallback
    const gradientPairs = [
      { from: "#FBF3E2", to: "#D9B98A" },
      { from: "#A8B89A", to: "#3F5E47" },
      { from: "#E0793C", to: "#9E3621" },
      { from: "#3A3A3A", to: "#1C1C1C" },
      { from: "#F4B9A6", to: "#E07A5F" },
      { from: "#F6C453", to: "#D98A28" },
    ];

    const mappedOfficial = officialTemplates.map((t, index) => {
      const gradient = gradientPairs[index % gradientPairs.length];
      return {
        id: t.id,
        title: t.title,
        category: t.category,
        packagingType: t.packagingType,
        previewImageUrl: t.previewImageUrl,
        gradientFrom: gradient.from,
        gradientTo: gradient.to,
        promptPreset: t.promptPreset,
        colorMood: t.colorMood,
        styleTags: t.styleTags,
        description: t.description,
        colorPalette: [],
        isFeatured: t.isFeatured,
        createdAt: t.createdAt,
        user: {
          name: t.styleTags?.includes("User Published") ? "Community User" : "Kemas.ai Official",
        }
      };
    });

    const allTemplates = [...mappedOfficial];
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
