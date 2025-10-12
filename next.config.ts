import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Vercel configuration (SSR mode)
  trailingSlash: true,
  images: {
    unoptimized: false, // Enable optimization for Vercel
  },
  /* config options here */
};

export default nextConfig;
