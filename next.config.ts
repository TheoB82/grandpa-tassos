import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['youtube.com', 'www.youtube.com'], // Allow images from YouTube (for thumbnails, etc.)
  },
  // No need for the `allowImportingInPage` option.
};

export default nextConfig;
