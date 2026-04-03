import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? '/EcoNexo' : '';
const assetPrefix = isGitHubPages ? '/EcoNexo' : '';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
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
      unoptimized: false,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
        },
      ],
    },
  }),
};

export default withBundleAnalyzer(nextConfig);
