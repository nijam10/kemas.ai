import { prisma } from './lib/prisma';
import fs from 'fs';
import path from 'path';

async function urlToBase64(url: string): Promise<string | null> {
  try {
    let fetchUrl = url;
    // If it's the proxy API format, convert it back to localhost to fetch it directly from the script
    if (url.startsWith('/api/image')) {
      const urlObj = new URL('http://localhost:3000' + url);
      const filename = urlObj.searchParams.get('filename');
      const subfolder = urlObj.searchParams.get('subfolder') || 'KemasAI';
      const type = urlObj.searchParams.get('type') || 'output';
      fetchUrl = `http://localhost:8000/view?filename=${filename}&subfolder=${subfolder}&type=${type}`;
    }

    // if already base64, just return it
    if (url.startsWith('data:image')) {
       return url;
    }

    console.log("Fetching: " + fetchUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.log("Failed to fetch: " + fetchUrl);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("Error fetching " + url, err);
    return null;
  }
}

async function main() {
  const templates = await prisma.galleryTemplate.findMany();
  for (const t of templates) {
    if (!t.previewImageUrl.startsWith('data:image')) {
      console.log(`Processing template ${t.title}...`);
      const base64 = await urlToBase64(t.previewImageUrl);
      if (base64) {
        await prisma.galleryTemplate.update({
          where: { id: t.id },
          data: { previewImageUrl: base64 }
        });
        console.log(`Updated template ${t.title}`);
      }
    }
  }

  const designs = await prisma.design.findMany();
  for (const d of designs) {
    let updateData: any = {};
    if (d.imageUrl && !d.imageUrl.startsWith('data:image')) {
      const b64 = await urlToBase64(d.imageUrl);
      if (b64) updateData.imageUrl = b64;
    }
    if (d.wrapperUrl && !d.wrapperUrl.startsWith('data:image')) {
      const b64 = await urlToBase64(d.wrapperUrl);
      if (b64) updateData.wrapperUrl = b64;
    }
    if (d.thumbnailUrl && !d.thumbnailUrl.startsWith('data:image')) {
      const b64 = await urlToBase64(d.thumbnailUrl);
      if (b64) updateData.thumbnailUrl = b64;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.design.update({
        where: { id: d.id },
        data: updateData
      });
      console.log(`Updated design ${d.title}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
