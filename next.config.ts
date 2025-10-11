import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuration for static export and GitHub Pages
  output: process.env.VERCEL ? undefined : 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages (if using custom domain, set to '/')
  basePath: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '/EcoNexo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '/EcoNexo/' : '',
  /* config options here */
};

export default nextConfig;
