/**
 * POST /api/generate
 *
 * Submits a packaging generation job to ComfyUI.
 *
 * Accepts multipart/form-data OR application/json:
 *   - prompt        (string, required, min 10 chars)
 *   - packagingType (string, required)
 *   - logo          (File, optional) — uploaded to ComfyUI input folder
 *
 * Flow:
 *   1. Verify Auth.js session
 *   2. Parse body (multipart or JSON)
 *   3. Validate prompt + packagingType
 *   4. Check CreditWallet balance >= 10
 *   5. Upload logo to ComfyUI if provided
 *   6. Create Design (PROCESSING) + GenerationJob (QUEUED)
 *   7. Build workflow with injected inputs
 *   8. Submit to ComfyUI /prompt
 *   9. Store prompt_id in GenerationJob.runpodJobId
 *  10. Return { designId, jobId, promptId }
 *
 * Credits are NOT deducted here — only on successful completion.
 */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  submitPrompt,
  uploadLogo,
  ComfyUIUnavailableError,
  ComfyUIWorkflowError,
  ComfyUIConfigError,
} from "@/lib/comfyui";
import { buildWorkflow } from "@/lib/workflow";
import type { PackagingType } from "@prisma/client";

// ── Packaging type mapping ────────────────────────────────────────────────────

const PACKAGING_TYPE_MAP: Record<string, PackagingType> = {
  "standing-pouch": "STANDING_POUCH",
  "pillow-pouch": "PILLOW_POUCH",
  box: "BOX",
  jar: "JAR",
  bottle: "BOTTLE",
  sachet: "SACHET",
  STANDING_POUCH: "STANDING_POUCH",
  PILLOW_POUCH: "PILLOW_POUCH",
  BOX: "BOX",
  JAR: "JAR",
  BOTTLE: "BOTTLE",
  SACHET: "SACHET",
};

function titleFromPrompt(prompt: string): string {
  const clean = prompt.trim().replace(/\s+/g, " ");
  return clean.length > 50 ? clean.slice(0, 47) + "…" : clean;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  // ── 2. Parse body (multipart or JSON) ─────────────────────────────────────
  let rawPrompt = "";
  let rawPackagingType = "";
  let logoBuffer: Buffer | null = null;
  let logoFilename: string | null = null;
  let logoMimeType = "image/png";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid form data." },
        { status: 400 }
      );
    }
    rawPrompt = (formData.get("prompt") as string | null)?.trim() ?? "";
    rawPackagingType = (formData.get("packagingType") as string | null) ?? "";

    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      logoBuffer = Buffer.from(arrayBuffer);
      logoFilename = logoFile.name;
      logoMimeType = logoFile.type || "image/png";
    }
  } else {
    // JSON body
    let body: { prompt?: unknown; packagingType?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }
    rawPrompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";
    rawPackagingType =
      typeof body.packagingType === "string" ? body.packagingType : "";
  }

  // ── 3. Validate ───────────────────────────────────────────────────────────
  if (rawPrompt.length < 10) {
    return NextResponse.json(
      { success: false, error: "Prompt must be at least 10 characters." },
      { status: 400 }
    );
  }

  const packagingType: PackagingType | undefined =
    PACKAGING_TYPE_MAP[rawPackagingType];
  if (!packagingType) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid packagingType "${rawPackagingType}". Must be one of: standing-pouch, pillow-pouch, box, jar, bottle, sachet`,
      },
      { status: 400 }
    );
  }

  // ── 4. Credit check ───────────────────────────────────────────────────────
  const wallet = await prisma.creditWallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance < 10) {
    return NextResponse.json(
      {
        success: false,
        error: `Insufficient credits. You need 10 but have ${wallet?.balance ?? 0}.`,
      },
      { status: 402 }
    );
  }

  // ── 5. Upload logo to ComfyUI (if provided) ───────────────────────────────
  let comfyLogoFilename: string | null = null;
  if (logoBuffer && logoFilename) {
    try {
      const uploadResult = await uploadLogo(
        logoBuffer,
        logoFilename,
        logoMimeType
      );
      comfyLogoFilename = uploadResult.filename;
    } catch (err) {
      // Logo upload failure is non-fatal — fall back to default logo
      console.warn(
        "[generate] Logo upload failed, using default logo:",
        err instanceof Error ? err.message : err
      );
    }
  }

  // ── 6. Create Design + GenerationJob ─────────────────────────────────────
  const design = await prisma.design.create({
    data: {
      userId,
      title: titleFromPrompt(rawPrompt),
      prompt: rawPrompt,
      packagingType,
      status: "PROCESSING",
      creditsUsed: 10,
      imageUrl: null,
      thumbnailUrl: null,
      logoUrl: comfyLogoFilename ?? null,
    },
  });

  const job = await prisma.generationJob.create({
    data: {
      userId,
      designId: design.id,
      status: "QUEUED",
      currentStep: "API_GATEWAY",
      startedAt: new Date(),
    },
  });

  // ── 7. Build workflow + submit ────────────────────────────────────────────
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  let promptId: string;
  try {
    const workflow = buildWorkflow({
      prompt: rawPrompt,
      packagingType,
      businessName: userProfile?.businessName ?? null,
      brandCategory: userProfile?.brandCategory ?? null,
      logoFilename: comfyLogoFilename,
    });

    const result = await submitPrompt(workflow);
    promptId = result.promptId;
  } catch (err) {
    // Mark as failed — no credits deducted
    await prisma.$transaction([
      prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          errorMessage:
            err instanceof Error ? err.message : "Failed to submit to ComfyUI",
          completedAt: new Date(),
        },
      }),
      prisma.design.update({
        where: { id: design.id },
        data: { status: "FAILED" },
      }),
    ]);

    if (
      err instanceof ComfyUIConfigError ||
      err instanceof ComfyUIUnavailableError
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The AI generation server is currently unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }
    if (err instanceof ComfyUIWorkflowError) {
      return NextResponse.json(
        { success: false, error: `Workflow error: ${err.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }

  // ── 8. Store prompt_id + update job to RUNNING ────────────────────────────
  await prisma.generationJob.update({
    where: { id: job.id },
    data: {
      runpodJobId: promptId, // stores ComfyUI prompt_id
      status: "RUNNING",
      currentStep: "COMFYUI_PIPELINE",
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      designId: design.id,
      jobId: job.id,
      promptId,
    },
  });
}
