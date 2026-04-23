import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "is1-ssl.mzstatic.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
