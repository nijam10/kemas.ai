import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
