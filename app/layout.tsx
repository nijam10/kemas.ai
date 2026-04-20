import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";

// 1. Konfigurasi Plus Jakarta Sans untuk Heading
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// 2. Konfigurasi Inter untuk Body Text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kemas.ai | AI Packaging Design for UMKM",
  description: "Tingkatkan daya saing visual produk UMKM Anda dengan desain kemasan berbasis LoRA AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable}`}>
      {/* Menambahkan font variabel ke body sangat penting agar CSS di globals.css 
        bisa membaca font-family dan warna background/foreground dengan benar.
      */}
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}