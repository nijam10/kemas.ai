export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filename = searchParams.get("filename");
    const subfolder = searchParams.get("subfolder") || "KemasAI";
    const type = searchParams.get("type") || "output";

    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    const fastapiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    const remoteUrl = `${fastapiUrl}/view?filename=${filename}&subfolder=${subfolder}&type=${type}`;

    let response;
    try {
      response = await fetch(remoteUrl, {
        headers: {
          "ngrok-skip-browser-warning": "69420"
        },
        // add a short timeout so it doesn't hang forever if server is completely unresponsive
        signal: AbortSignal.timeout(3000) 
      });
    } catch (fetchError) {
      // Fetch failed entirely (server offline/unreachable)
      const fallbackUrl = request.nextUrl.clone();
      fallbackUrl.pathname = '/designs/cfc28559-898d-443f-8e93-3bc5b37f4671_mockup.png';
      return NextResponse.redirect(fallbackUrl);
    }

    if (!response.ok) {
      // Server responded but with error (e.g. 404 image not found)
      const fallbackUrl = request.nextUrl.clone();
      fallbackUrl.pathname = '/designs/cfc28559-898d-443f-8e93-3bc5b37f4671_mockup.png';
      return NextResponse.redirect(fallbackUrl);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
