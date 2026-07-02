export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Form Data
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const packagingType = formData.get("packaging_type") as any || "STANDING_POUCH";
    const productName = formData.get("product_name") as string || "Untitled Design";
    
    // Map packaging type from frontend to enum
    const packagingTypeEnumMap: Record<string, any> = {
      "standing-pouch": "STANDING_POUCH",
      "pillow-pouch": "PILLOW_POUCH",
      "box": "BOX",
      "jar": "JAR"
    };
    const mappedPackagingType = packagingTypeEnumMap[packagingType] || "STANDING_POUCH";

    // 3. Credit Check & Deduction (Atomic Transaction)
    let wallet = await prisma.creditWallet.findUnique({ where: { userId } });
    
    // Auto-create wallet for existing users who logged in before the wallet system was added
    if (!wallet) {
      wallet = await prisma.creditWallet.create({
        data: { userId, balance: 40, dailyQuota: 40 }
      });
      await prisma.creditTransaction.create({
        data: {
          userId,
          amount: 40,
          type: "DAILY_RESET",
          description: "Welcome credits (Auto-initialized)",
        }
      });
    }

    if (wallet.balance < 10) {
      return NextResponse.json({ success: false, error: "Insufficient credits. You need 10 credits to generate." }, { status: 402 });
    }

    let design, job;
    try {
      // Execute the deduction and record creation in a single transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct 10 credits
        await tx.creditWallet.update({
          where: { userId },
          data: { balance: { decrement: 10 } }
        });

        // Create Design Record
        const newDesign = await tx.design.create({
          data: {
            userId,
            title: productName,
            prompt,
            packagingType: mappedPackagingType,
            status: "PROCESSING",
            creditsUsed: 10
          }
        });

        // Create Generation Job Record
        const newJob = await tx.generationJob.create({
          data: {
            userId,
            designId: newDesign.id,
            status: "QUEUED",
            currentStep: "API_GATEWAY"
          }
        });

        // Create Transaction Log
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -10,
            type: "GENERATION_USAGE",
            description: `Generated: ${newDesign.title}`,
            referenceId: newDesign.id
          }
        });

        return { newDesign, newJob };
      });
      design = result.newDesign;
      job = result.newJob;
    } catch (e: any) {
       console.error("Transaction Error:", e);
       return NextResponse.json({ success: false, error: "Database transaction failed" }, { status: 500 });
    }

    // 4. Forward to FastAPI
    if (formData.has("job_id")) formData.delete("job_id");
    formData.append("job_id", design.id);

    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Refund credits and mark failed if FastAPI rejects the request
      await prisma.$transaction([
        prisma.creditWallet.update({
          where: { userId },
          data: { balance: { increment: 10 } }
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            amount: 10,
            type: "REFUND",
            description: `Refund for failed generation: ${design.title}`,
            referenceId: design.id
          }
        }),
        prisma.design.update({
          where: { id: design.id },
          data: { status: "FAILED" }
        }),
        prisma.generationJob.update({
          where: { id: job.id },
          data: { status: "FAILED", errorMessage: `FastAPI error: ${errorText}` }
        })
      ]);

      return NextResponse.json(
        { success: false, error: `FastAPI error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Update job with prompt_id (runpodJobId)
    await prisma.generationJob.update({
      where: { id: job.id },
      data: { runpodJobId: data.prompt_id }
    });

    return NextResponse.json({
      success: true,
      data: {
        jobId: design.id,
        promptId: data.prompt_id,
      },
    });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

