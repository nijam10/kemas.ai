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

    // A list of available mockups in the /public/designs/ folder
    const fallbackMockups = [
      '/designs/0c73ae39-c745-4078-887e-7e58ae1cf209_mockup.png',
      '/designs/1137a2bb-3d14-4d33-b5a6-b4155408d554_mockup.png',
      '/designs/209db9b7-e6e2-408a-8a85-d4491cce38b0_mockup.png',
      '/designs/4a6b7b5c-15a6-487e-bda1-dbb08463db74_mockup.png',
      '/designs/57b6b25a-037f-40db-98f9-b41b64124cb2_mockup.png',
      '/designs/7f67ddc0-3e61-42d7-a98e-a719bf9d35fc_mockup.png',
      '/designs/7fbab5c7-09bc-44c6-a035-94c60fd66b9c_mockup.png',
      '/designs/9d6b9e56-063a-41d3-a4ff-2a1f96e06364_mockup.png',
      '/designs/cfc28559-898d-443f-8e93-3bc5b37f4671_mockup.png'
    ];

    // Helper to pick a consistent fallback based on filename
    const getFallbackUrl = () => {
      let hash = 0;
      for (let i = 0; i < filename.length; i++) {
        hash = filename.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % fallbackMockups.length;
      
      const fallbackUrl = request.nextUrl.clone();
      fallbackUrl.pathname = fallbackMockups[index];
      return fallbackUrl;
    };

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
      return NextResponse.redirect(getFallbackUrl());
    }

    if (!response.ok) {
      // Server responded but with error (e.g. 404 image not found)
      return NextResponse.redirect(getFallbackUrl());
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
