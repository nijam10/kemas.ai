export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { creditService } from "@/server/services/credit.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Account not found" }, 
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const packagingType = formData.get("packaging_type") as any || "STANDING_POUCH";
    const productName = formData.get("product_name") as string || "Untitled Design";
    
    const packagingTypeEnumMap: Record<string, any> = {
      "standing-pouch": "STANDING_POUCH",
      "pillow-pouch": "PILLOW_POUCH",
      "box": "BOX",
      "jar": "JAR"
    };
    const mappedPackagingType = packagingTypeEnumMap[packagingType] || "STANDING_POUCH";

    let wallet = await creditService.dailyResetIfNeeded(userId);
    
    if (!wallet) {
      await prisma.creditWallet.create({
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
      wallet = await creditService.dailyResetIfNeeded(userId);
    }

    if (!wallet || wallet.balance < 10) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 402 });
    }

    let design, job;
    try {
      const result = await prisma.$transaction(async (tx) => {
        await tx.creditWallet.update({
          where: { userId },
          data: { balance: { decrement: 10 } }
        });

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

        const newJob = await tx.generationJob.create({
          data: {
            userId,
            designId: newDesign.id,
            status: "QUEUED",
            currentStep: "API_GATEWAY"
          }
        });

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
       console.error(e);
       return NextResponse.json({ success: false, error: "Transaction failed" }, { status: 500 });
    }

    const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    if (formData.has("job_id")) formData.delete("job_id");
    formData.append("job_id", design.id);

    try {
      const response = await fetch(`${fastapiUrl}/generate`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        
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
            data: { status: "FAILED", errorMessage: `API error: ${errorText}` }
          })
        ]);

        return NextResponse.json(
          { success: false, error: `API error: ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();

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
    } catch (fetchErr) {
      console.error(fetchErr);

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
            description: `Refund: generation server unreachable — ${design.title}`,
            referenceId: design.id
          }
        }),
        prisma.design.update({
          where: { id: design.id },
          data: { status: "FAILED" }
        }),
        prisma.generationJob.update({
          where: { id: job.id },
          data: {
            status: "FAILED",
            errorMessage: "Service unavailable"
          }
        })
      ]);

      return NextResponse.json(
        { success: false, error: "Service unavailable" },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

