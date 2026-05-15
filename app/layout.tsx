import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kemas.ai | AI Packaging Design for UMKM",
  description:
    "Generate stunning, market-ready packaging designs and product mockups in seconds with LoRA-powered AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-inter antialiased bg-[#FCFBF7] text-[#1A1A1A]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
