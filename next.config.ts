import type { NextConfig } from "next";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

const allowedDevOrigins = [
  "*.replit.dev",
  "*.replit.app",
  "*.picard.replit.dev",
  ...(replitDevDomain ? [replitDevDomain] : []),
];

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
  allowedDevOrigins,
  webpack(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
