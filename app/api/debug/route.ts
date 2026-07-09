import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const templates = await prisma.galleryTemplate.findMany();
  return NextResponse.json(templates);
}
