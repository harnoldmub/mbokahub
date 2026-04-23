import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "is1-ssl.mzstatic.com",
        protocol: "https",
      },
      {
        hostname: "*.replit.dev",
        protocol: "https",
      },
      {
        hostname: "*.replit.app",
        protocol: "https",
      },
    ],
  },
  allowedDevOrigins: ["*.replit.dev", "*.replit.app"],
  webpack(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
