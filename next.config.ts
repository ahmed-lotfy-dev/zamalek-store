import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  images: {
    minimumCacheTTL: 60,
  },
  // Skip static generation during build to avoid DB/Redis connection issues
  experimental: {
    // This ensures pages are rendered at request time, not build time
  },
};

export default withNextIntl(nextConfig);
