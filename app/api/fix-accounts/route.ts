import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Cari user Khai Nzm
    const user = await prisma.user.findFirst({
      where: { email: 'khainzm61@gmail.com' }
    });

    if (!user) {
      return NextResponse.json({ message: "User Khai Nzm not found" });
    }

    // Cari semua akun Google yang tertaut ke Khai Nzm
    const linkedAccounts = await prisma.account.findMany({
      where: { userId: user.id, provider: 'google' }
    });
    
    await prisma.account.deleteMany({
      where: { 
        userId: user.id 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Berhasil menghapus tautan akun Google dari profil Khai Nzm. Silakan coba login kembali menggunakan akun mana saja, sistem akan mendaftarkannya ulang dengan benar.",
      linkedAccountsFound: linkedAccounts.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
