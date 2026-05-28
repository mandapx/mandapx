import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.venuemonk.com" },
      { protocol: "https", hostname: "img.weddingbazaar.com" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
