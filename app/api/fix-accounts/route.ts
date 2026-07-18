import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Hapus SEMUA data di tabel Account. 
    // Ini akan mereset semua tautan Google dari semua user,
    // sangat aman untuk masa testing.
    const deleted = await prisma.account.deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: `Database berhasil dibersihkan! Menghapus ${deleted.count} tautan akun. Silakan coba login kembali.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
