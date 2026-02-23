import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8032';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/images/:path*',
        destination: `${backendUrl}/images/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
