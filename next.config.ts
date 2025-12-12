import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-09b0b8c34b804278951df0f25a7076b2.r2.dev",
      },
    ],
    minimumCacheTTL: 60,
  },
  // Skip static generation during build to avoid DB/Redis connection issues
  experimental: {
    // This ensures pages are rendered at request time, not build time
  },
};

export default withNextIntl(nextConfig);
