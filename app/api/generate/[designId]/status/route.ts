export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getHistory, getImageUrl, ComfyUIUnavailableError } from "@/lib/comfyui";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;
  const { designId } = await params;

  const design = await prisma.design.findFirst({
    where: { id: designId, userId },
    include: { generationJob: true },
  });

  if (!design) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const job = design.generationJob;

  if (design.status === "COMPLETED" || design.status === "FAILED") {
    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: design.status,
        currentStep: job?.currentStep ?? null,
        imageUrl: design.imageUrl,
        wrapperUrl: design.wrapperUrl,
        thumbnailUrl: design.thumbnailUrl,
        errorMessage: job?.errorMessage ?? null,
      },
    });
  }

  const promptId = job?.runpodJobId;
  if (!job || !promptId) {
    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: "PROCESSING",
        currentStep: job?.currentStep ?? "API_GATEWAY",
        imageUrl: null,
        wrapperUrl: null,
        thumbnailUrl: null,
        errorMessage: null,
      },
    });
  }

  let comfyStatus;
  try {
    comfyStatus = await getHistory(promptId);
  } catch (err) {
    if (err instanceof ComfyUIUnavailableError) {
      return NextResponse.json({
        success: true,
        data: {
          designId: design.id,
          status: design.status,
          currentStep: job.currentStep,
          imageUrl: design.imageUrl,
          wrapperUrl: design.wrapperUrl,
          thumbnailUrl: null,
          errorMessage: "Service temporarily unreachable",
        },
      });
    }
    throw err;
  }

  if (comfyStatus.status === "QUEUED" || comfyStatus.status === "RUNNING") {
    const step = comfyStatus.status === "QUEUED" ? "API_GATEWAY" : "COMFYUI_PIPELINE";
    await prisma.generationJob.update({
      where: { id: job.id },
      data: { currentStep: step as never },
    });
    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: "PROCESSING",
        currentStep: step,
        imageUrl: null,
        wrapperUrl: null,
        thumbnailUrl: null,
        errorMessage: null,
      },
    });
  }

  if (comfyStatus.status === "FAILED") {
    await prisma.$transaction([
      prisma.design.update({
        where: { id: design.id },
        data: { status: "FAILED" },
      }),
      prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          currentStep: "COMFYUI_PIPELINE",
          errorMessage: comfyStatus.error,
          completedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: "FAILED",
        currentStep: "COMFYUI_PIPELINE",
        imageUrl: null,
        wrapperUrl: null,
        thumbnailUrl: null,
        errorMessage: comfyStatus.error,
      },
    });
  }

  if (comfyStatus.status === "COMPLETED") {
    const wrapperImage = comfyStatus.images.find(img => img.nodeId === "105") ?? comfyStatus.images[0];
    const mockupImage = comfyStatus.images.find(img => img.nodeId === "206") ?? comfyStatus.images[1] ?? comfyStatus.images[0];

    const wrapperUrlComfy = wrapperImage ? getImageUrl(wrapperImage) : null;
    const imageUrlComfy = mockupImage ? getImageUrl(mockupImage) : null;

    let localWrapperUrl = null;
    let localImageUrl = null;

    async function downloadToLocal(comfyUrl: string, suffix: string) {
      try {
        const response = await fetch(comfyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = `${design.id}_${suffix}.png`;
        const filepath = path.join(process.cwd(), 'public', 'designs', filename);
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, buffer);
        return `/designs/${filename}`;
      } catch (e) {
        console.error(e);
        return comfyUrl;
      }
    }

    if (wrapperUrlComfy) {
      localWrapperUrl = await downloadToLocal(wrapperUrlComfy, 'wrapper');
    }
    if (imageUrlComfy) {
      localImageUrl = await downloadToLocal(imageUrlComfy, 'mockup');
    }

    const wrapperUrl = localWrapperUrl || wrapperUrlComfy;
    const imageUrl = localImageUrl || imageUrlComfy;

    const existingTx = await prisma.creditTransaction.findFirst({
      where: { userId, referenceId: design.id, type: "GENERATION_USAGE" },
    });

    if (!existingTx) {
      await prisma.$transaction([
        prisma.creditWallet.update({
          where: { userId },
          data: { balance: { decrement: 10 } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            amount: -10,
            type: "GENERATION_USAGE",
            description: `Generated: ${design.title}`,
            referenceId: design.id,
          },
        }),
      ]);
    }

    await prisma.$transaction([
      prisma.design.update({
        where: { id: design.id },
        data: {
          status: "COMPLETED",
          imageUrl,
          wrapperUrl,
          thumbnailUrl: imageUrl,
        },
      }),
      prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          currentStep: "OUTPUT_READY",
          completedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: "COMPLETED",
        currentStep: "OUTPUT_READY",
        imageUrl,
        wrapperUrl,
        thumbnailUrl: imageUrl,
        errorMessage: null,
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      designId: design.id,
      status: design.status,
      currentStep: job.currentStep,
      imageUrl: design.imageUrl,
      wrapperUrl: design.wrapperUrl,
      thumbnailUrl: design.thumbnailUrl,
      errorMessage: null,
    },
  });
}
