import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google"; // 1. Import fontnya
import "./globals.css";

// 2. Konfigurasi Plus Jakarta Sans
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta", // Variabel CSS yang akan dipanggil di globals.css
  display: "swap",
});

// 3. Konfigurasi Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Variabel CSS yang akan dipanggil di globals.css
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
    // 4. Masukkan variabel font ke dalam class name <html> agar bisa diakses seluruh aplikasi
    <html lang="id" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}