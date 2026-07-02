import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { designId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { designId } = params;

    // Fetch the design
    const design = await prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 });
    }

    if (design.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (!design.imageUrl) {
      return NextResponse.json({ success: false, error: "Design has no generated image yet" }, { status: 400 });
    }

    // Check if it's already published (we can use slug as unique identifier, e.g., "design-[id]")
    const slug = `design-${design.id}`;
    const existing = await prisma.galleryTemplate.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Design is already published" }, { status: 400 });
    }

    // Create GalleryTemplate
    const published = await prisma.galleryTemplate.create({
      data: {
        title: design.title,
        slug,
        description: `Published by user. Prompt: ${design.prompt}`,
        category: "SNACKS", // Default for now
        packagingType: design.packagingType,
        previewImageUrl: design.imageUrl,
        promptPreset: design.prompt,
        colorMood: "Custom",
        styleTags: ["User Published"],
        isFeatured: false,
      },
    });

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("[POST /api/designs/publish]", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish design" },
      { status: 500 }
    );
  }
}
