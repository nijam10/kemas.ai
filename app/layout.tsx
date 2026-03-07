import type { Metadata } from "next";
import "./globals.css"; // Memanggil Tailwind CSS agar aktif di semua halaman

export const metadata: Metadata = {
  title: "Kemas.ai | AI Packaging Design for UMKM",
  description:
    "Tingkatkan daya saing visual produk UMKM Anda dengan desain kemasan berbasis LoRA AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {/* 'children' ini nantinya adalah isi dari page.tsx kamu */}
        {children}
      </body>
    </html>
  );
}
