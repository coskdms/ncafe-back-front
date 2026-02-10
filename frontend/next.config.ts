import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/:path*',
        },
        {
          source: '/images/:path*',
          destination: 'http://localhost:8080/images/:path*',
        },
      ];
    }
    return [];
  },
  images: {
    unoptimized: true, // 모든 외부 이미지 허용 (개발 편의성)
  },
};

export default nextConfig;
