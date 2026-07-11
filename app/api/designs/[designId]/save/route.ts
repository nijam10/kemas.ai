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

    const { designId } = await params;

    const design = await prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 });
    }

    if (design.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.design.update({
      where: { id: designId },
      data: { isSaved: !design.isSaved }
    });

    return NextResponse.json({ success: true, data: { isSaved: updated.isSaved } });
  } catch (error) {
    console.error("[POST /api/designs/save]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save design" },
      { status: 500 }
    );
  }
}
