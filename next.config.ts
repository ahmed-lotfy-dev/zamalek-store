import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  images: {
    minimumCacheTTL: 60,
  },
  output: "standalone", // Enable standalone output
};

export default withNextIntl(nextConfig);
