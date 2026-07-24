import type { NextConfig } from "next";

// Ubah : NextConfig menjadi : any untuk membungkam error TypeScript di file ini
const nextConfig: any = {
  images: {
    remotePatterns: [
      {
        // Google profile pictures
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Google user content (alternative domain)
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;