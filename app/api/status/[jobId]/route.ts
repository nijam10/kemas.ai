export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    // 1. Auth & Ownership Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    // Load Design & Job
    const design = await prisma.design.findFirst({
      where: { id: jobId, userId },
      include: { generationJob: true },
    });

    if (!design) {
      return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 });
    }

    const job = design.generationJob;

    // 2. Return cached if terminal state
    if (design.status === "COMPLETED" || design.status === "FAILED") {
      return NextResponse.json({
        success: true,
        data: {
          jobId: design.id,
          status: design.status.toLowerCase(),
          currentStep: job?.currentStep ?? null,
          master_wrapper_url: design.wrapperUrl,
          front_mockup_url: design.imageUrl,
          errorMessage: job?.errorMessage ?? null,
        }
      });
    }

    // 3. Proxy to FastAPI to get live status
    const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    const response = await fetch(`${fastapiUrl}/status/${jobId}`, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `FastAPI error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const fastApiStatus = data.data.status?.toUpperCase(); // expected: "QUEUED", "RUNNING", "COMPLETED", "FAILED"

    // 4. Update DB based on FastAPI status
    if (fastApiStatus === "COMPLETED") {
       let wrapperUrl = data.data.master_wrapper_url;
       let imageUrl = data.data.front_mockup_url;

       // Download images locally so they survive server restarts
       const fs = require('fs');
       const path = require('path');
       
       async function downloadToLocal(remoteUrl: string, suffix: string) {
         try {
           const res = await fetch(remoteUrl);
           if (!res.ok) return remoteUrl;
           const buffer = Buffer.from(await res.arrayBuffer());
           const filename = `${design.id}_${suffix}.png`;
           const filepath = path.join(process.cwd(), 'public', 'designs', filename);
           await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
           await fs.promises.writeFile(filepath, buffer);
           return `/designs/${filename}`;
         } catch (e) {
           console.error("Failed to download image:", e);
           return remoteUrl;
         }
       }

       if (wrapperUrl) wrapperUrl = await downloadToLocal(wrapperUrl, 'wrapper');
       if (imageUrl) imageUrl = await downloadToLocal(imageUrl, 'mockup');

       await prisma.$transaction([
         prisma.design.update({
           where: { id: design.id },
           data: {
             status: "COMPLETED",
             wrapperUrl: wrapperUrl,
             imageUrl: imageUrl,
             thumbnailUrl: imageUrl
           }
         }),
         ...(job ? [prisma.generationJob.update({
           where: { id: job.id },
           data: {
             status: "COMPLETED",
             currentStep: "OUTPUT_READY",
             completedAt: new Date()
           }
         })] : [])
       ]);
    } else if (fastApiStatus === "FAILED") {
       // Refund credits on failure
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
         ...(job ? [prisma.generationJob.update({
           where: { id: job.id },
           data: {
             status: "FAILED",
             errorMessage: data.data.errorMessage || "FastAPI reported failure",
             completedAt: new Date()
           }
         })] : [])
       ]);
    } else {
       // Just update current step if valid
       if (data.data.currentStep && job && data.data.currentStep !== "COMPLETED") {
         await prisma.generationJob.update({
           where: { id: job.id },
           data: { currentStep: data.data.currentStep as never }
         });
       }
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("Status API Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
