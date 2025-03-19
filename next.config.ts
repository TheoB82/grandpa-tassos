import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['youtube.com', 'www.youtube.com'], // For thumbnails
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              frame-src https://www.youtube.com https://www.youtube-nocookie.com;
              script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com;
              style-src 'self' 'unsafe-inline';
              connect-src 'self';
              img-src 'self' data: https://www.youtube.com https://i.ytimg.com;
            `.replace(/\s{2,}/g, ' ').trim(), // Collapse whitespace
          },
        ],
      },
    ];
  },
};

export default nextConfig;
