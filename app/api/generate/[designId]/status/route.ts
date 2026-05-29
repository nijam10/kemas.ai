/**
 * GET /api/generate/[designId]/status
 *
 * Polls the generation status for a specific design.
 * Called by the preview page every few seconds while PROCESSING/RUNNING.
 *
 * Flow:
 *   1. Verify Auth.js session
 *   2. Load Design + GenerationJob — verify ownership
 *   3. If already COMPLETED or FAILED, return local DB state
 *   4. If still running, query ComfyUI /history/{promptId}
 *   5. On COMPLETED: save imageUrl, deduct credits (idempotent), update DB
 *   6. On FAILED: update DB, do NOT deduct credits
 *   7. Return current status + imageUrl
 *
 * Must run in Node runtime (uses Prisma).
 */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getHistory,
  getImageUrl,
  ComfyUIUnavailableError,
} from "@/lib/comfyui";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const { designId } = await params;

  // ── 2. Load Design + Job ──────────────────────────────────────────────────
  const design = await prisma.design.findFirst({
    where: { id: designId, userId }, // ownership check
    include: { generationJob: true },
  });

  if (!design) {
    return NextResponse.json(
      { success: false, error: "Design not found." },
      { status: 404 }
    );
  }

  const job = design.generationJob;

  // ── 3. Already terminal — return DB state ─────────────────────────────────
  if (design.status === "COMPLETED" || design.status === "FAILED") {
    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: design.status,
        currentStep: job?.currentStep ?? null,
        imageUrl: design.imageUrl,
        thumbnailUrl: design.thumbnailUrl,
        errorMessage: job?.errorMessage ?? null,
      },
    });
  }

  // ── 4. No job record or no prompt_id — can't poll ─────────────────────────
  const promptId = job?.runpodJobId; // we store ComfyUI prompt_id here
  if (!job || !promptId) {
    return NextResponse.json({
      success: true,
      data: {
        designId: design.id,
        status: "PROCESSING",
        currentStep: job?.currentStep ?? "API_GATEWAY",
        imageUrl: null,
        thumbnailUrl: null,
        errorMessage: null,
      },
    });
  }

  // ── 5. Poll ComfyUI ───────────────────────────────────────────────────────
  let comfyStatus;
  try {
    comfyStatus = await getHistory(promptId);
  } catch (err) {
    // ComfyUI unreachable — return current DB state without failing
    if (err instanceof ComfyUIUnavailableError) {
      return NextResponse.json({
        success: true,
        data: {
          designId: design.id,
          status: design.status,
          currentStep: job.currentStep,
          imageUrl: design.imageUrl,
          thumbnailUrl: null,
          errorMessage: "Generation server temporarily unreachable",
        },
      });
    }
    throw err;
  }

  // ── 6a. Still running ─────────────────────────────────────────────────────
  if (comfyStatus.status === "QUEUED" || comfyStatus.status === "RUNNING") {
    const step =
      comfyStatus.status === "QUEUED" ? "API_GATEWAY" : "COMFYUI_PIPELINE";
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
        thumbnailUrl: null,
        errorMessage: null,
      },
    });
  }

  // ── 6b. Failed ────────────────────────────────────────────────────────────
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
        thumbnailUrl: null,
        errorMessage: comfyStatus.error,
      },
    });
  }

  // ── 6c. Completed ─────────────────────────────────────────────────────────
  if (comfyStatus.status === "COMPLETED") {
    // Pick the first output image (type=output preferred over temp)
    const outputImages = comfyStatus.images.filter((img) => img.type === "output");
    const firstImage = outputImages[0] ?? comfyStatus.images[0];

    const imageUrl = firstImage ? getImageUrl(firstImage) : null;

    // ── Idempotent credit deduction ───────────────────────────────────────
    // Check if a GENERATION_USAGE transaction already exists for this design
    const existingTx = await prisma.creditTransaction.findFirst({
      where: { userId, referenceId: design.id, type: "GENERATION_USAGE" },
    });

    if (!existingTx) {
      // Deduct credits atomically
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

    // Update Design + Job
    await prisma.$transaction([
      prisma.design.update({
        where: { id: design.id },
        data: {
          status: "COMPLETED",
          imageUrl,
          thumbnailUrl: imageUrl, // use same URL for thumbnail for now
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
        thumbnailUrl: imageUrl,
        errorMessage: null,
      },
    });
  }

  // Fallback
  return NextResponse.json({
    success: true,
    data: {
      designId: design.id,
      status: design.status,
      currentStep: job.currentStep,
      imageUrl: design.imageUrl,
      thumbnailUrl: design.thumbnailUrl,
      errorMessage: null,
    },
  });
}
