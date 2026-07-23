import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase";
import * as fs from "fs";
import * as path from "path";

// A list of available local mockups to upload as fallbacks
const fallbackMockups = [
  '0c73ae39-c745-4078-887e-7e58ae1cf209_mockup.png',
  '1137a2bb-3d14-4d33-b5a6-b4155408d554_mockup.png',
  '209db9b7-e6e2-408a-8a85-d4491cce38b0_mockup.png',
  '4a6b7b5c-15a6-487e-bda1-dbb08463db74_mockup.png',
  '57b6b25a-037f-40db-98f9-b41b64124cb2_mockup.png',
  '7f67ddc0-3e61-42d7-a98e-a719bf9d35fc_mockup.png',
  '7fbab5c7-09bc-44c6-a035-94c60fd66b9c_mockup.png',
  '9d6b9e56-063a-41d3-a4ff-2a1f96e06364_mockup.png',
  'cfc28559-898d-443f-8e93-3bc5b37f4671_mockup.png'
];

export async function GET() {
  try {
    const templates = await prisma.galleryTemplate.findMany();
    
    let updated = 0;
    
    for (const t of templates) {
      if (t.previewImageUrl.includes('/api/image')) {
        // Find a deterministic fallback image based on ID
        const hash = t.id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        const index = Math.abs(hash) % fallbackMockups.length;
        const fileName = fallbackMockups[index];
        
        // Read file from local public/designs
        const filePath = path.join(process.cwd(), 'public', 'designs', fileName);
        if (!fs.existsSync(filePath)) {
          console.warn(`File not found: ${filePath}`);
          continue;
        }
        
        const buffer = fs.readFileSync(filePath);
        
        // Upload to Supabase
        const { data: uploadData, error } = await supabaseServer
          .storage
          .from('designs')
          .upload(`gallery/${t.id}_${fileName}`, buffer, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (error) {
          console.error(`Failed to upload ${t.id}:`, error);
          continue;
        }
        
        const { data: publicUrlData } = supabaseServer
          .storage
          .from('designs')
          .getPublicUrl(uploadData.path);
          
        // Update DB
        await prisma.galleryTemplate.update({
          where: { id: t.id },
          data: { previewImageUrl: publicUrlData.publicUrl }
        });
        
        updated++;
      }
    }
    
    return NextResponse.json({ success: true, updated, message: "Gallery templates migrated to Supabase" });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
