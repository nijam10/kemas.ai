import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, filename, subfolder = "", folderType = "output" } = body;

    if (!jobId || !filename) {
      return NextResponse.json({ success: false, error: "jobId and filename are required" }, { status: 400 });
    }

    const payload = {
      job_id: jobId,
      filename: filename,
      subfolder: subfolder,
      folder_type: folderType
    };

    const response = await fetch("http://localhost:8000/upscale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ success: false, error: errText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
