import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // ★ /api/* 요청: Next.js API Routes(BFF)가 처리 → JWT 주입 → Spring Boot
  // ★ /images/* 요청: 이미지는 Spring Boot 정적 리소스를 직접 프록시
  async rewrites() {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8032';
    return [
      {
        source: '/next-images/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
