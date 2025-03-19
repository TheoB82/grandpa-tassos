/** @type {import('next').NextConfig} */
const nextConfig = {
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
            value: "frame-src https://www.youtube.com https://www.youtube-nocookie.com; default-src 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
