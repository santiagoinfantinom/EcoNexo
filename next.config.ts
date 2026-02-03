import type { NextConfig } from "next";

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? '/EcoNexo' : '';
const assetPrefix = isGitHubPages ? '/EcoNexo' : '';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // GitHub Pages configuration (static export)
  ...(isGitHubPages && {
    output: 'export',
    basePath,
    assetPrefix,
    images: {
      unoptimized: true,
    },
  }),
  // Vercel configuration (SSR mode)
  ...(!isGitHubPages && {
    images: {
      unoptimized: false, // Enable optimization for Vercel
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
  }),
};

export default nextConfig;
