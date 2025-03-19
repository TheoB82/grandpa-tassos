import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['youtube.com', 'www.youtube.com', 'i.ytimg.com', 'your-image-domain.com'], // Add any other image domains here
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
              img-src 'self' data: https://www.youtube.com https://i.ytimg.com https://your-image-domain.com; // Add your image domains here
            `.replace(/\s{2,}/g, ' ').trim(), // Collapse whitespace
          },
        ],
      },
    ];
  },
};

export default nextConfig;
